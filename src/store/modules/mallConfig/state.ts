export interface MallConfigState {
  auth_page: any
  bar_title: any
  cat_style: any
  copyright: any
  mall: any
  navbar: any
  plugin: any
  share_setting: any
  share_setting_custom: any
  user_center: any
  __wxapp_img: any
  theme_color: any
  theme: any
  windowHeight: any
}

export const state = {
  auth_page: {
    pic_url: '',
  },
  bar_title: {},
  cat_style: {},
  copyright: {},
  mall: {
    setting: {
      theme_color: 'classic-red',
    },
  },
  navbar: {
    navs: [],
  },
  plugin: {
    vip_card: {
      setting: {
        background: '#f7f7f7',
      },
    },
  },
  share_setting: [],
  share_setting_custom: {},
  user_center: {},
  __wxapp_img: {},
  theme_color: {
    key: 'a',
    color: '#ff4544',
    background: '#ff4544',
    border: '#ff4544',
    border_s: '#f39800',
    background_s: '#f39800',
    main_text: '#ffffff',
    secondary_text: '#ffffff',
    border_m:
      'border-color: #ff4544;border-bottom-color: transparent;border-left-color: transparent;border-right-color: transparent;',
    background_o: 'rgba(255,69,68, 0.1)',
    background_p: 'rgba(255,69,68, 0.2)',
    background_l: 'rgba(255,69,68, 0.35)',
    background_q: 'rgba(255,69,68, 0.8)',
    background_gradient: 'linear-gradient(140deg, #ff4544, #f39800)',
    background_gradient_l: 'linear-gradient(to right, rgba(255,69,68, 1), rgba(255,69,68, 0.5))',
    background_gradient_o: 'linear-gradient(to right, rgba(255,69,68, 1), rgba(255,69,68, 0.7))',
    background_s_gradient_o: 'linear-gradient(to right, rgb(243,152,0),rgba(243,152,0, 0.7))',
    background_gradient_btn: 'linear-gradient(to left, rgb(255,69,68),rgba(255,69,68, 0.7))',
    background_s_gradient_btn: 'linear-gradient(to right, rgb(243,152,0),rgba(243,152,0, 0.7))',
  },
  theme: 'classic-red',
  windowHeight: {
    height: 0,
    width: 0,
    boolean: false,
  },
}
