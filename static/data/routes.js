export default [
  {
    id: 0,
    name: "八达岭核心景区路线",
    shortName: "核心",
    count: 3,
    color: "#1aad19",
    direction: "north",
    data: [
      {
        id: 1,
        name: "八达岭长城",
        longitude: 115.980,
        latitude: 40.360,
        hint: "世界文化遗产,必游景点",
        icon: "attraction"
      },
      {
        id: 4,
        name: "八达岭长城入口",
        longitude: 115.970,
        latitude: 40.365,
        hint: "游客中心,购票处",
        icon: "entrance"
      },
      {
        id: 7,
        name: "长城博物馆",
        longitude: 115.976,
        latitude: 40.364,
        hint: "了解长城历史文化",
        icon: "attraction"
      }
    ],
    circles: [
      {
        latitude: 40.363,
        longitude: 115.975,
        radius: 500
      }
    ]
  },
  {
    id: 1,
    name: "冬奥景区路线",
    shortName: "冬奥",
    count: 2,
    color: "#4080ff",
    direction: "east",
    data: [
      {
        id: 5,
        name: "冬奥会滑雪场",
        longitude: 115.965,
        latitude: 40.355,
        hint: "2022北京冬奥会场馆",
        icon: "attraction"
      },
      {
        id: 8,
        name: "八达岭野生动物园",
        longitude: 115.979,
        latitude: 40.363,
        hint: "亲近自然,观赏野生动物",
        icon: "attraction"
      }
    ],
    circles: [
      {
        latitude: 40.359,
        longitude: 115.972,
        radius: 800
      }
    ]
  },
  {
    id: 2,
    name: "休闲购物路线",
    shortName: "休闲",
    count: 3,
    color: "#ff6b6b",
    direction: "south",
    data: [
      {
        id: 3,
        name: "八达岭古长城餐厅",
        longitude: 115.972,
        latitude: 40.362,
        hint: "品尝特色长城宴",
        icon: "food"
      },
      {
        id: 6,
        name: "八达岭长城纪念品商店",
        longitude: 115.968,
        latitude: 40.358,
        hint: "购买长城特色纪念品",
        icon: "shop"
      },
      {
        id: 2,
        name: "北京延庆万豪酒店",
        longitude: 115.975,
        latitude: 40.370,
        hint: "五星级酒店,舒适住宿",
        icon: "hotel"
      }
    ],
    circles: [
      {
        latitude: 40.365,
        longitude: 115.972,
        radius: 600
      }
    ]
  }
]; 