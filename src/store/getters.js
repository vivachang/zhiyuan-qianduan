const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  name: state => state.user.name,
  admin_detail:state => state.user.admin_detail,
  is_get_authority:state => state.user.is_get_authority,
  routers:state => state.user.routers,
  roleList:state => state.user.role_list,
  dictionary:state => state.user.dictionaryList
}
export default getters
