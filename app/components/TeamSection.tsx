'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TEAM_MEMBERS = [
  {
    name: 'TS. Nguyễn Thị Thu Hà',
    role: 'Phó Hiệu trưởng trường Đại học Văn Lang',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'ThS. Bùi Phạm Lan Phương',
    role: 'Phó Hiệu trưởng trường Đại học Văn Lang',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'PGS. TS. Lê Phước Bình',
    role: 'Trưởng khoa Kỹ thuật Xây dựng',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'TS. Trần Nguyễn Mai Anh',
    role: 'Giảng viên chuyên môn Nền móng',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop'
  }
];

export default function TeamSection() {
  return (
    <section className="relative py-24 overflow-hidden text-white font-sans bg-[#002f54]">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0 z-0 bg-[#002f54]">
        {/* By using luminosity blending, the image naturally adopts the Navy blue base color perfectly! */}
        <img
          src="/images/life/bg_ufm.jpg"
          alt="UFM Background"
          className="w-full h-full object-cover object-center opacity-60 transition-opacity duration-1000"
          style={{ mixBlendMode: 'luminosity' }}
        />
        {/* Artistic Gradient: Solid left for text, highly transparent right to let the school background pop */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#002f54] via-[#002f54]/80 to-[#002f54]/5" />

        {/* Top & Bottom seamless shadow blending */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#002f54] to-transparent opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#002f54] to-transparent opacity-80" />
      </div>

      {/* Decorative Lines simulating the right background */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-[0.25] hidden md:block z-0">
        <svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M400 500C220 500 100 400 100 250C100 100 250 0 400 0" stroke="white" strokeWidth="1" />
          <path d="M400 450C250 450 150 360 150 250C150 140 280 50 400 50" stroke="white" strokeWidth="1" />
          <path d="M400 400C280 400 200 320 200 250C200 180 310 100 400 100" stroke="white" strokeWidth="1" />
          <line x1="100" y1="500" x2="100" y2="400" stroke="white" strokeWidth="1" />
          <line x1="150" y1="500" x2="150" y2="420" stroke="white" strokeWidth="1" />
          <line x1="200" y1="500" x2="200" y2="450" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      <div className="vlu-news-container mx-auto max-w-[1240px] relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

          {/* Left Content */}
          <div className="w-full lg:w-[35%] flex flex-col justify-center">
            <h2 className="text-[32px] md:text-[40px] font-bold mb-6 leading-tight drop-shadow-sm text-white">
              Đội ngũ của<br />chúng tôi
            </h2>
            <p className="text-slate-300 text-[15px] md:text-[16px] leading-relaxed mb-8 pr-4">
              Các chương trình đào tạo của Văn Lang được dẫn dắt bởi đội ngũ giáo sư và giảng viên uy tín. Họ là những người đầu ngành, là những người ủng hộ lợi ích sinh viên, những nhà giáo dục tận tâm luôn đồng hành cùng bạn để mang lại tác động truyền cảm hứng cho xã hội.
            </p>
            <div className="flex items-center gap-4 cursor-pointer group w-max">
              <span className="font-bold text-[16px] text-white group-hover:text-[#ffd200] transition-colors">Tìm hiểu thêm</span>
              <div className="w-10 h-6 bg-[#ffd200] rounded-[3px] flex items-center justify-center transition-transform group-hover:translate-x-1 shadow-md">
                <ChevronRight className="w-4 h-4 text-[#002f54]" strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Right Slider */}
          <div className="w-full lg:w-[65%] min-w-0 mt-8 lg:mt-0 relative">
            {/* Note the explicit ID inside slider to wrap custom styles safely */}
            <div id="vlu-team-swiper-wrapper" className="relative w-full">
              <Swiper
                modules={[Pagination]}
                spaceBetween={24}
                slidesPerView={1.3}
                breakpoints={{
                  640: { slidesPerView: 2.2 },
                  1024: { slidesPerView: 2.5 },
                  1280: { slidesPerView: 2.8 }
                }}
                pagination={{
                  clickable: true,
                  el: '.custom-team-pagination'
                }}
                className="!pb-16"
              >
                {TEAM_MEMBERS.map((member, idx) => (
                  <SwiperSlide key={idx} className="!h-auto">
                    <div className="bg-[#002244] rounded-[4px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.4)] h-full flex flex-col group">
                      <div className="w-full aspect-square md:aspect-[5/6] overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-start">
                        <h3 className="font-bold text-[17px] text-white mb-1.5 leading-snug line-clamp-2 min-h-[44px]">{member.name}</h3>
                        <p className="text-slate-200 text-[13px] leading-relaxed line-clamp-3">{member.role}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Pagination Container mapping to the visual provided */}
              <div className="absolute bottom-0 left-0 w-full flex items-center justify-between z-10 px-2 mt-4">
                <div className="custom-team-pagination flex gap-2 items-center"></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Required CSS for custom swiper pagination/nav */}
      <style dangerouslySetInnerHTML={{
        __html: `
        #vlu-team-swiper-wrapper .swiper-wrapper {
           align-items: stretch;
        }
        #vlu-team-swiper-wrapper .custom-team-pagination {
           display: flex;
           align-items: center;
           gap: 12px;
        }
        #vlu-team-swiper-wrapper .swiper-pagination-bullet {
           width: 8px;
           height: 8px;
           background: rgba(255,255,255,0.3);
           border-radius: 4px;
           transition: all 0.3s ease;
           opacity: 1;
           margin: 0 !important;
           cursor: pointer;
        }
        #vlu-team-swiper-wrapper .swiper-pagination-bullet:hover {
           background: rgba(255,255,255,0.8);
        }
        #vlu-team-swiper-wrapper .swiper-pagination-bullet-active {
           width: 8px;
           background: #ffd200;
        }
      `}} />
    </section>
  );
}
