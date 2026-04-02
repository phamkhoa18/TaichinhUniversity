import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IHomePage extends Document {
  heroSlides: Array<{
    image: string
    mobileImage: string
    title: string
    subtitle: string
    order: number
  }>
  videoHighlight: {
    url: string
    videoId: string
    title: string
    desc: string
    linkText: string
    linkUrl: string
  }
  aboutStats: Array<{
    value: string
    desc: string
    order: number
  }>
  achievements: Array<{
    image: string
    title: string
    order: number
  }>
  featuredNewsIds: string[] | any[]
  updatedAt: Date
}

const homePageSchema = new Schema<IHomePage>(
  {
    heroSlides: [
      {
        image: { type: String, default: '' },
        mobileImage: { type: String, default: '' },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        order: { type: Number, default: 0 },
      },
    ],
    videoHighlight: {
      url: { type: String, default: '' },
      videoId: { type: String, default: '' },
      title: { type: String, default: 'Nâng tầm tư duy, kiến tạo tương lai đột phá' },
      desc: { type: String, default: 'Viện Đào tạo Sau Đại học UFM...' },
      linkText: { type: String, default: 'Tìm hiểu thêm về chúng tôi' },
      linkUrl: { type: String, default: '#' },
    },
    aboutStats: [
      {
        value: { type: String, default: '' },
        desc: { type: String, default: '' },
        order: { type: Number, default: 0 },
      },
    ],
    achievements: [
      {
        image: { type: String, default: '' },
        title: { type: String, default: '' },
        order: { type: Number, default: 0 },
      },
    ],
    featuredNewsIds: [{ type: Schema.Types.ObjectId, ref: 'News' }]
  },
  { timestamps: true }
)

const HomePage: Model<IHomePage> = mongoose.models.HomePage || mongoose.model<IHomePage>('HomePage', homePageSchema)

export default HomePage

// Singleton pattern helper
export async function getHomePageConfig(): Promise<IHomePage> {
  let config = await HomePage.findOne()
  if (!config) {
    config = await HomePage.create({
      heroSlides: [
        {
          image: '/images/hero-banner/1.png',
          mobileImage: '/images/hero-banner/banner-ads.jpg',
          title: 'NÂNG TẦM\nTRI THỨC',
          subtitle: 'Viện Đào tạo Sau Đại học UFM – Kiến tạo thế hệ lãnh đạo tài chính tương lai',
          order: 0,
        }
      ],
      videoHighlight: {
        url: 'https://vimeo.com/832386996',
        videoId: '832386996',
        title: 'Nâng tầm tư duy, kiến tạo tương lai đột phá',
        desc: 'Viện Đào tạo Sau Đại học UFM không chỉ trang bị nền tảng kiến thức chuyên sâu cấp quản lý, mà còn khơi dậy tư duy nghiên cứu độc lập, giúp học viên nhạy bén với ý tưởng mới, làm chủ sự thay đổi và tạo bệ phóng vững chắc cho những đột phá chiến lược trong sự nghiệp.',
        linkText: 'Tìm hiểu thêm về chúng tôi',
        linkUrl: '#'
      },
      aboutStats: [
        { value: '5.000+', desc: 'học viên cao học và nghiên cứu sinh', order: 0 },
        { value: '12', desc: 'chương trình đào tạo Thạc sĩ và Tiến sĩ', order: 1 },
        { value: '92%', desc: 'học viên thăng tiến trong vòng 1 năm', order: 2 },
        { value: '150+', desc: 'đối tác doanh nghiệp và quốc tế', order: 3 },
      ],
      achievements: [
        { image: '/images/hero-campus.png', title: '9 chương trình Thạc sĩ và 3 chương trình Tiến sĩ đạt chuẩn kiểm định chất lượng', order: 0 },
        { image: '/images/lecture-hall.png', title: 'Đội ngũ giảng viên 100% trình độ Tiến sĩ, Phó Giáo sư, Giáo sư', order: 1 },
        { image: '/images/students-library.png', title: 'Hệ thống số hóa toàn diện – Đào tạo kết hợp trực tiếp và trực tuyến', order: 2 },
      ]
    })
  }
  return config
}
