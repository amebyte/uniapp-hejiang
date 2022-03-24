import { LOGIN_STATUS, USER_INFO } from '@/config/cache'
import Cache from '@/utils/cache'
export interface AppState {
  token: string
  userInfo: any
}

export const state: AppState = {
  //   token: Cache.get(LOGIN_STATUS) || 's1mJ74NXSk1bJNoABfVPUkBukaBtgtdD',
  token: Cache.get(LOGIN_STATUS) || '',
  //   userInfo: Cache.get(USER_INFO)
  //     ? JSON.parse(Cache.get(USER_INFO))
  //     : JSON.parse(
  //         '{"nickname":"coboy","mobile":"","avatar":"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJnNElpiaOszibzJb0ghuK5V0BibWDicBEaOWWQOPYoFicgD7rcZ7FtszSrnkR7eQRibiatA2hwyk6ABOXeA/132","integral":0,"balance":"0.00","options":{"id":2,"user_id":3,"avatar":"https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJnNElpiaOszibzJb0ghuK5V0BibWDicBEaOWWQOPYoFicgD7rcZ7FtszSrnkR7eQRibiatA2hwyk6ABOXeA/132","integral":0,"total_integral":0,"balance":"0.00","total_balance":"0.00","parent_id":0,"is_blacklist":0,"contact_way":"","remark":"","is_delete":0,"junior_at":"0000-00-00 00:00:00","platform":"wxapp","temp_parent_id":0,"remark_name":"","pay_password":""},"favorite":"0","footprint":"6","identity":{"parent_name":"总店","level_name":"普通用户","member_level":0,"member_pic_url":"","is_admin":0},"coupon":"0","card":"0","is_vip_card_user":0,"platform":"wxapp","is_pay_password":0,"is_show_pay_code":0,"unionid":"aHR0cHM6Ly93d3cuempoZWppYW5nLmNvbQ==","check_in":{"continue":0,"total":0,"todayAward":""},"subscribe":false,"other_config":[],"wechat_name":"柏德","wechat_logo":"https://mall.fsbaide.cn/web/uploads/mall1/20211211/17cc67685404e25b583e241f838f59a4.jpg","qrcode":"https://mall.fsbaide.cn/web/uploads/mall1/20211211/17cc67685404e25b583e241f838f59a4.jpg"}'
  //       ),
  userInfo: Cache.get(USER_INFO) ? JSON.parse(Cache.get(USER_INFO)) : null,
}
