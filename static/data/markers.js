export default [
  {
    name: "全部",
    icon: "all",
    color: "#1aad19",
    data: [
      {
        id: 1,
        name: "八达岭长城",
        short_name: "八达岭长城",
        position: 1,
        icon: "attraction",
        longitude: 115.980,
        latitude: 40.360,
        audio: "/static/audio/badaling.mp3",
        images: [
          "/static/images/logos/logo.png",
          "/static/images/logos/logo.png",
          "/static/images/logos/logo.png"
        ],
        desc: "八达岭长城位于北京市延庆区军都山关沟古道北口，是万里长城向游人开放最早的地段，也是明长城中最具代表性的部分，为明代居庸关的重要前哨，海拔高达1015米，地势险要，城关坚固，历来是拱卫京师的军事要塞。",
        history: "八达岭长城始建于明洪武年间（公元1368年—1398年），是明代长城重要关口居庸关的前哨，为京师重要屏障。明长城的建设和修缮基本都集中在嘉靖以前，永乐年间的第二次较大规模修筑，是为嘉靖长城奠定了基础。现存的八达岭长城主要是嘉靖年间重修的（公元1552年前后）。",
        tips: [
          "参观八达岭长城需提前预约，预约后请按预约时间入园",
          "建议穿着舒适的运动鞋，长城台阶较陡",
          "夏季游览请注意防晒，冬季请注意保暖",
          "景区内设有饮水点和休息区，可适当休息"
        ],
        open_time: "周一至周日 07:30-18:00",
        ticket_info: "旺季（4月1日-10月31日）：45元/人；淡季（11月1日-次年3月31日）：40元/人；学生、老人、军人等凭有效证件享受优惠票。",
        transport: "乘坐S2线列车，或877路公交车可直达八达岭长城景区；自驾导航'八达岭长城景区'即可。",
        panorama_id: "badaling1"
      },
      {
        id: 2,
        name: "北京延庆万豪酒店",
        short_name: "万豪酒店",
        position: 2,
        icon: "hotel",
        longitude: 115.975,
        latitude: 40.370,
        desc: "北京延庆万豪酒店是一家豪华五星级酒店，位于延庆区市中心，地理位置优越，交通便利，距离八达岭长城仅15分钟车程。",
        open_time: "全天候服务",
        contact: "010-8412xxxx"
      },
      {
        id: 3,
        name: "八达岭古长城餐厅",
        short_name: "长城餐厅",
        position: 3,
        icon: "food",
        longitude: 115.972,
        latitude: 40.362,
        desc: "八达岭古长城餐厅位于八达岭长城景区内，提供正宗的北京风味和当地特色菜肴，是游客品尝地道美食的理想之地。",
        open_time: "09:00-17:00",
        contact: "010-6912xxxx"
      },
      {
        id: 4,
        name: "八达岭长城入口",
        short_name: "长城入口",
        position: 4,
        icon: "entrance",
        longitude: 115.970,
        latitude: 40.365,
        desc: "八达岭长城景区南入口，设有售票处、游客中心、免费厕所、行李寄存处等设施。游客可在此购票、咨询信息、存放行李。",
        open_time: "07:30-17:00",
        tips: [
          "游客需在此处排队购票或检票入园",
          "旺季时排队人数较多，建议提前网上预约"
        ]
      },
      {
        id: 5,
        name: "冬奥会滑雪场",
        short_name: "滑雪场",
        position: 5,
        icon: "attraction@1.2",
        longitude: 115.965,
        latitude: 40.355,
        desc: "延庆冬奥会滑雪场是2022年北京冬奥会的主要场馆之一，赛后对公众开放，成为冬季旅游的热门景点。",
        open_time: "冬季09:00-17:00",
        ticket_info: "普通票180元/人，含基础滑雪设备租赁",
        tips: [
          "初学者建议参加滑雪培训课程",
          "请注意安全，遵守滑雪场规则"
        ]
      },
      {
        id: 6,
        name: "八达岭长城纪念品商店",
        short_name: "纪念品店",
        position: 6,
        icon: "shop",
        longitude: 115.968,
        latitude: 40.358,
        desc: "八达岭长城纪念品商店提供各类长城主题纪念品，包括T恤、磁贴、明信片、传统工艺品等，是购买伴手礼的好去处。",
        open_time: "08:30-17:30"
      },
      {
        id: 7,
        name: "长城博物馆",
        short_name: "长城博物馆",
        position: 7,
        icon: "attraction",
        longitude: 115.976,
        latitude: 40.364,
        desc: "长城博物馆是专门收藏、研究、展示长城文物和历史文化的专题博物馆，馆内珍藏了大量与长城有关的历史文物和资料，是了解长城历史文化的重要场所。",
        open_time: "09:00-16:00（周一闭馆）",
        ticket_info: "免费参观",
        tips: [
          "建议参观时间1-2小时",
          "请勿触摸展品，保持安静"
        ],
        audio: "/static/audio/museum.mp3"
      },
      {
        id: 8,
        name: "八达岭野生动物园",
        short_name: "野生动物园",
        position: 8,
        icon: "attraction@1.1",
        longitude: 115.979,
        latitude: 40.363,
        desc: "八达岭野生动物园是华北地区规模最大的自驾式野生动物园，园内饲养了来自世界各地的上百种珍稀野生动物，游客可以在专用车内近距离观赏动物。",
        open_time: "09:00-17:00",
        ticket_info: "成人票180元/人，儿童票90元/人",
        tips: [
          "自驾区域内请勿下车，不要将手伸出窗外",
          "不要向动物投食",
          "建议游览时间3-4小时"
        ]
      }
    ]
  },
  {
    name: "景点",
    icon: "attraction",
    color: "#bc8f56",
    data: [
      {
        id: 1,
        name: "八达岭长城",
        short_name: "八达岭长城",
        position: 1,
        icon: "attraction",
        longitude: 115.980,
        latitude: 40.360,
        audio: "/static/audio/badaling.mp3",
        images: [
          "/static/images/logos/logo.png",
          "/static/images/logos/logo.png",
          "/static/images/logos/logo.png"
        ],
        desc: "八达岭长城位于北京市延庆区军都山关沟古道北口，是万里长城向游人开放最早的地段，也是明长城中最具代表性的部分，为明代居庸关的重要前哨，海拔高达1015米，地势险要，城关坚固，历来是拱卫京师的军事要塞。",
        history: "八达岭长城始建于明洪武年间（公元1368年—1398年），是明代长城重要关口居庸关的前哨，为京师重要屏障。明长城的建设和修缮基本都集中在嘉靖以前，永乐年间的第二次较大规模修筑，是为嘉靖长城奠定了基础。现存的八达岭长城主要是嘉靖年间重修的（公元1552年前后）。",
        tips: [
          "参观八达岭长城需提前预约，预约后请按预约时间入园",
          "建议穿着舒适的运动鞋，长城台阶较陡",
          "夏季游览请注意防晒，冬季请注意保暖",
          "景区内设有饮水点和休息区，可适当休息"
        ],
        open_time: "周一至周日 07:30-18:00",
        ticket_info: "旺季（4月1日-10月31日）：45元/人；淡季（11月1日-次年3月31日）：40元/人；学生、老人、军人等凭有效证件享受优惠票。",
        transport: "乘坐S2线列车，或877路公交车可直达八达岭长城景区；自驾导航'八达岭长城景区'即可。",
        panorama_id: "badaling1"
      },
      {
        id: 5,
        name: "冬奥会滑雪场",
        short_name: "滑雪场",
        position: 5,
        icon: "attraction@1.2",
        longitude: 115.965,
        latitude: 40.355,
        desc: "延庆冬奥会滑雪场是2022年北京冬奥会的主要场馆之一，赛后对公众开放，成为冬季旅游的热门景点。",
        open_time: "冬季09:00-17:00",
        ticket_info: "普通票180元/人，含基础滑雪设备租赁",
        tips: [
          "初学者建议参加滑雪培训课程",
          "请注意安全，遵守滑雪场规则"
        ]
      },
      {
        id: 7,
        name: "长城博物馆",
        short_name: "长城博物馆",
        position: 7,
        icon: "attraction",
        longitude: 115.976,
        latitude: 40.364,
        desc: "长城博物馆是专门收藏、研究、展示长城文物和历史文化的专题博物馆，馆内珍藏了大量与长城有关的历史文物和资料，是了解长城历史文化的重要场所。",
        open_time: "09:00-16:00（周一闭馆）",
        ticket_info: "免费参观",
        tips: [
          "建议参观时间1-2小时",
          "请勿触摸展品，保持安静"
        ],
        audio: "/static/audio/museum.mp3"
      },
      {
        id: 8,
        name: "八达岭野生动物园",
        short_name: "野生动物园",
        position: 8,
        icon: "attraction@1.1",
        longitude: 115.979,
        latitude: 40.363,
        desc: "八达岭野生动物园是华北地区规模最大的自驾式野生动物园，园内饲养了来自世界各地的上百种珍稀野生动物，游客可以在专用车内近距离观赏动物。",
        open_time: "09:00-17:00",
        ticket_info: "成人票180元/人，儿童票90元/人",
        tips: [
          "自驾区域内请勿下车，不要将手伸出窗外",
          "不要向动物投食",
          "建议游览时间3-4小时"
        ]
      }
    ]
  },
  {
    name: "餐饮",
    icon: "food",
    color: "#ff6b6b",
    data: [
      {
        id: 3,
        name: "八达岭古长城餐厅",
        short_name: "长城餐厅",
        position: 3,
        icon: "food",
        longitude: 115.972,
        latitude: 40.362,
        desc: "八达岭古长城餐厅位于八达岭长城景区内，提供正宗的北京风味和当地特色菜肴，是游客品尝地道美食的理想之地。",
        open_time: "09:00-17:00",
        contact: "010-6912xxxx"
      }
    ]
  },
  {
    name: "住宿",
    icon: "hotel",
    color: "#4080ff",
    data: [
      {
        id: 2,
        name: "北京延庆万豪酒店",
        short_name: "万豪酒店",
        position: 2,
        icon: "hotel",
        longitude: 115.975,
        latitude: 40.370,
        desc: "北京延庆万豪酒店是一家豪华五星级酒店，位于延庆区市中心，地理位置优越，交通便利，距离八达岭长城仅15分钟车程。",
        open_time: "全天候服务",
        contact: "010-8412xxxx"
      }
    ]
  },
  {
    name: "购物",
    icon: "shop",
    color: "#9c27b0",
    data: [
      {
        id: 6,
        name: "八达岭长城纪念品商店",
        short_name: "纪念品店",
        position: 6,
        icon: "shop",
        longitude: 115.968,
        latitude: 40.358,
        desc: "八达岭长城纪念品商店提供各类长城主题纪念品，包括T恤、磁贴、明信片、传统工艺品等，是购买伴手礼的好去处。",
        open_time: "08:30-17:30"
      }
    ]
  }
]; 