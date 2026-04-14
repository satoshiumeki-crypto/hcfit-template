/**
 * サイト設定ファイル
 * このファイルを編集するか、admin.html の管理画面から設定を変更できます。
 */
const SITE_CONFIG = {
  // ===== 会社情報 =====
  company: {
    name: "AXIA接骨院",
    nameEn: "AXIA",
    address: "〒700-0012 岡山県岡山市北区いずみ町2-1-3",
    phone1: {
      label: "ご予約・お問い合わせ",
      number: "086-233-0100",
      hours: "平日 9:00〜20:00 / 土曜 9:00〜13:00"
    },
    phone2: {
      label: "急患・ご相談",
      number: "086-233-0101",
      hours: "平日 9:00〜20:00"
    },
    copyright: "© 2024 AXIA接骨院 All Rights Reserved."
  },

  // ===== ナビゲーション =====
  nav: [
    { label: "ホーム", href: "#" },
    { label: "初めての方へ", href: "#concept" },
    { label: "施術メニュー", href: "#service", dropdown: true },
    { label: "院の紹介", href: "#contact" }
  ],

  // ===== ヒーローセクション =====
  hero: {
    title: "その痛み、\n私たちにお任せください。",
    description: "交通事故・スポーツ外傷・肩こり・腰痛に特化した施術で\nあなたの「動ける身体」を取り戻します。\n丁寧なカウンセリングと的確な施術で根本改善を目指します。",
    cta1: { label: "Web予約", icon: "📅", href: "https://mypages.epark.jp/", external: true },
    cta2: { label: "お問い合わせ", icon: "✉", href: "mailto:info@axia-sekkotsu.com?subject=お問い合わせ", external: true },
    backgroundImage: ""
  },

  // ===== コンセプト =====
  concept: {
    subtitle: "AXIAが選ばれる理由",
    heading: "「痛みの原因」にアプローチする根本施術",
    descriptions: [
      "AXIA接骨院では、痛みの表面的な緩和ではなく、身体のバランスや姿勢、生活習慣まで含めた根本的な原因にアプローチします。",
      "最新の施術機器と手技療法を組み合わせたオーダーメイド施術で、患者様一人ひとりの症状に合わせた最適な治療プランをご提案。再発防止のためのセルフケア指導まで一貫してサポートいたします。"
    ],
    image: ""
  },

  // ===== サービス =====
  service: {
    lead: "「痛みがなかなか取れない」「どこに行けば良いかわからない」とお悩みの方へ",
    mainTitle: "施術メニュー",
    items: [
      {
        title: "交通事故施術",
        description: "むち打ち・腰痛・打撲など交通事故によるケガを専門的に施術。自賠責保険適用で窓口負担0円。事故直後から示談前まで丁寧にサポートいたします。",
        linkText: "交通事故施術について",
        linkHref: "#",
        image: ""
      },
      {
        title: "スポーツ外傷・コンディショニング",
        description: "捻挫・肉離れ・オスグッドなどスポーツに伴うケガの施術から、パフォーマンス向上のためのコンディショニングまで。アスリートの早期復帰を全力でサポートします。",
        linkText: "スポーツ施術について",
        linkHref: "#",
        image: ""
      }
    ]
  },

  // ===== 選ばれる理由 =====
  reason: {
    items: [
      {
        icon: "🏥",
        title: "丁寧なカウンセリング",
        description: "初回は30分以上かけて症状の原因を徹底分析。痛みの場所だけでなく、姿勢・動作・生活習慣まで総合的に診て施術プランを組み立てます。"
      },
      {
        icon: "⚡",
        title: "最新設備×手技の融合",
        description: "ハイボルテージ電気治療・超音波治療などの最新機器と、経験豊富なスタッフの手技療法を組み合わせることで、より効果的な施術を実現します。"
      },
      {
        icon: "🕐",
        title: "夜20時まで受付・予約優先制",
        description: "お仕事帰りでも通いやすい夜20時まで受付。予約優先制で待ち時間を最小限に。忙しい方でも無理なく通院を続けられる環境を整えています。"
      }
    ]
  },

  // ===== 事例紹介 =====
  cases: {
    lead: "実際にAXIA接骨院で施術を受けた患者様の声をご紹介します。",
    items: [
      {
        tag: "交通事故",
        tagType: "new",
        name: "30代女性 / むち打ち症",
        description: "追突事故でむち打ちに。3ヶ月の通院で痛みがほぼ消失。保険手続きのサポートも助かりました。",
        image: ""
      },
      {
        tag: "スポーツ",
        tagType: "switch",
        name: "10代男性 / サッカー膝靭帯損傷",
        description: "部活中の膝のケガで来院。リハビリプログラムのおかげで2ヶ月後に練習復帰できました。",
        image: ""
      },
      {
        tag: "慢性痛",
        tagType: "new",
        name: "50代男性 / 慢性腰痛",
        description: "10年以上悩んだ腰痛が、姿勢矯正と筋膜リリースで劇的に改善。今では趣味のゴルフを楽しんでいます。",
        image: ""
      }
    ]
  },

  // ===== お問い合わせ =====
  contact: {
    lead: "お身体の痛みやお悩みは我慢せず、まずはお気軽にご相談ください。ご予約はお電話またはWebから承っております。"
  },

  // ===== FAQ（AIO/AEO対策） =====
  faq: [
    {
      question: "初めてですが、予約なしでも受診できますか？",
      answer: "はい、予約なしでもご来院いただけます。ただし予約優先制のため、事前のご予約をおすすめしております。"
    },
    {
      question: "交通事故の施術費用はかかりますか？",
      answer: "交通事故の場合、自賠責保険が適用されるため窓口でのご負担は0円です。保険会社とのやり取りもサポートいたします。"
    },
    {
      question: "どのような症状に対応していますか？",
      answer: "骨折・脱臼・捻挫・打撲・肉離れなどの急性症状から、肩こり・腰痛・膝痛などの慢性症状、交通事故によるむち打ち、スポーツ外傷まで幅広く対応しています。"
    },
    {
      question: "駐車場はありますか？",
      answer: "はい、院の前に5台分の専用駐車場をご用意しております。お車でのご来院も安心です。"
    }
  ],

  // ===== 地図（Googleマップ埋め込み） =====
  map: {
    // Googleマップの埋め込みURL（Googleマップ → 共有 → 地図を埋め込む → srcのURLをコピー）
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.2!2d139.7285!3d35.7328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQzJzU4LjEiTiAxMznCsDQzJzQyLjYiRQ!5e0!3m2!1sja!2sjp!4v1600000000000",
    hours: "平日 9:00〜20:00 / 土曜 9:00〜13:00\n日曜・祝日 休診"
  },

  // ===== デザイン設定 =====
  theme: {
    primaryColor: "#2563eb",
    primaryHoverColor: "#1d4ed8",
    darkColor: "#1e293b",
    darkHoverColor: "#0f172a",
    textColor: "#334155",
    textLightColor: "#64748b",
    bgSectionColor: "#f8fafc",
    bgFooterColor: "#0f172a",
    bgContactColor: "#1e293b",
    logoImage: "",
    logoText: "AXIA"
  },

  // ===== SEO設定 =====
  seo: {
    title: "AXIA接骨院 | 岡山市北区の交通事故・スポーツ外傷・腰痛専門",
    description: "岡山市北区いずみ町のAXIA接骨院。交通事故施術（自賠責保険対応・窓口負担0円）、スポーツ外傷、肩こり・腰痛の根本改善に特化。夜20時まで受付・予約優先制。",
    keywords: "接骨院, 岡山市, 交通事故, むち打ち, スポーツ外傷, 腰痛, 肩こり, AXIA, 整骨院",
    ogImage: "",
    canonicalUrl: "",
    language: "ja",
    region: "JP"
  }
};
