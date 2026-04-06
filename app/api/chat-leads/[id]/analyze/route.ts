import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { chatHistory } = await req.json();

    if (!chatHistory || !Array.isArray(chatHistory)) {
      return NextResponse.json({ error: 'Thiếu lịch sử chat' }, { status: 400 });
    }

    // Prepare history text
    const historyText = chatHistory
      .filter((m) => m.role !== 'system') // Exclude hidden setup prompts if any
      .map((m) => `${m.role === 'user' ? 'Người dùng' : 'Bot'}: ${m.content}`)
      .join('\n');

    // Call OpenRouter
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
    let analysisResult = {
      isPotential: false,
      score: 0,
      summary: 'Không thể phân tích do thiếu API Key hoặc lỗi',
      interestedPrograms: [],
    };

    if (OPENROUTER_API_KEY) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash', // You can use standard models here, gemini flash is cheap and fast
            messages: [
              {
                role: 'system',
                content: `Bạn là trợ lý phân tích dữ liệu khách hàng tuyển sinh cho Đại học UFM. 
Đọc đoạn chat sau và đánh giá xem người này có khả năng trở thành sinh viên (Lead tiềm năng) của trường không.
YÊU CẦU ĐẦU RA BẮT BUỘC (Chỉ trả về định dạng JSON, không giải thích):
{
  "isPotential": boolean (true nếu có biểu hiện quan tâm học thật sự, false nếu chỉ hỏi vớ vẩn),
  "score": number (Điểm tiềm năng từ 1 đến 10),
  "interestedPrograms": string[] (Danh sách các ngành học họ nhắc đến hoặc quan tâm),
  "summary": string (Tóm tắt ngắn gọn mục đích và nhu cầu của họ)
}`,
              },
              {
                role: 'user',
                content: `ĐOẠN CHAT:\n${historyText}`,
              },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0].message.content;
          try {
            const parsed = JSON.parse(content);
            analysisResult = { ...analysisResult, ...parsed };
          } catch (parseError) {
            console.error('Error parsing OpenRouter response', parseError);
          }
        } else {
          console.error('OpenRouter API error', await response.text());
        }
      } catch (err) {
        console.error('Failed to call OpenRouter:', err);
      }
    }

    // Determine if Lead is junk based on score
    const isJunk = analysisResult.score < 5 || !analysisResult.isPotential;

    if (isJunk) {
      // User requested to NOT save junk leads under 5 at all. Delete it from DB.
      await Lead.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: 'Lead đã bị xóa vì nội dung rác thiếu tiềm năng (< 5 điểm).' });
    }

    // Update Lead in DB. As requested, do NOT save the whole chatHistory, just the analysis.
    const lead = await Lead.findByIdAndUpdate(
      id,
      {
        aiAnalysis: analysisResult,
        status: 'New', // Above 5 score goes to New tab
      },
      { new: true }
    );

    if (!lead) {
      return NextResponse.json({ error: 'Không tìm thấy Lead' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    console.error('Error analyzing lead:', error);
    return NextResponse.json(
      { error: 'Gặp lỗi trong quá trình phân tích' },
      { status: 500 }
    );
  }
}
