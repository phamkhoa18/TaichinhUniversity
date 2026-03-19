'use client';

export default function PartnersSection() {
  const partners = [
    'BIDV', 'Vietcombank', 'VPBank', 'Techcombank', 'ACB',
    'MBBank', 'TPBank', 'HDBank', 'SHB', 'VIB',
    'KPMG', 'Deloitte', 'PwC', 'EY',
    'BIDV', 'Vietcombank', 'VPBank', 'Techcombank', 'ACB',
    'MBBank', 'TPBank', 'HDBank', 'SHB', 'VIB',
    'KPMG', 'Deloitte', 'PwC', 'EY',
  ];

  return (
    <section className="partners-section">
      <div className="partners-title">Đối tác & Nhà tuyển dụng hàng đầu</div>
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {partners.map((name, idx) => (
            <div
              key={idx}
              style={{
                height: 45,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 20px',
                background: 'rgba(0, 84, 150, 0.05)',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#005496',
                whiteSpace: 'nowrap',
                opacity: 0.6,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                flexShrink: 0,
                letterSpacing: '0.05em',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.background = 'rgba(0, 84, 150, 0.1)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.6';
                e.currentTarget.style.background = 'rgba(0, 84, 150, 0.05)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
