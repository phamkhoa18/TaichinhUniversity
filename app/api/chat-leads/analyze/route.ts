import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lead from '@/models/Lead';

export async function POST(req: Request) {
  try {
    const { fullName, phone, email, chatHistory } = await req.json();

    if (!fullName || !phone) {
      return NextResponse.json({ error: 'Thiếu thông tin liên hệ' }, { status: 400 });
    }

    if (!chatHistory || !Array.isArray(chatHistory) || chatHistory.length < 2) {
      return NextResponse.json({ success: true, message: 'Chưa có tương tác đủ để lưu.' }, { status: 200 });
    }

    // Chuẩn bị text lịch sử chat
    const historyText = chatHistory
      .filter((m) => m.role !== 'system')
      .map((m) => `${m.role === 'user' ? 'Người dùng' : 'Bot'}: ${m.content}`)
      .join('\n');

    // Gọi OpenRouter Gemini phân tích toàn bộ mẩu thoại
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
    let analysisResult = {
      isPotential: false,
      score: 0,
      summary: 'Không có API Key hoặc lỗi',
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
            model: 'google/gemini-2.5-flash',
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
}`
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
          } catch (parseError) {}
        }
      } catch (err) {}
    }

    // Nếu điểm dưới 5 thì KHÔNG LƯU vào hệ thống
    const isJunk = analysisResult.score < 5 || !analysisResult.isPotential;

    if (isJunk) {
      return NextResponse.json({ success: true, message: 'Lead dưới 5 điểm, KHÔNG gửi lên hệ thống DB.' }, { status: 200 });
    }

    // Nếu trên 5 điểm thì mới CREATE Lead trên Database
    await connectDB();
    const lead = await Lead.create({
      fullName,
      phone,
      email: email || '',
      source: 'AI_Chatbot',
      status: 'New',
      aiAnalysis: analysisResult,
    });

    return NextResponse.json({ success: true, lead });
  } catch (error: any) {
    console.error('Error analyzing lead:', error);
    return NextResponse.json(
      { error: 'Gặp lỗi trong quá trình phân tích và lưu' },
      { status: 500 }
    );
  }
}
