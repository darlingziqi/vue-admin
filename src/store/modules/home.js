import mockRequest from "../../utils/mockRequest"

const state = {
  data: {},
}

const mutations = {
  getData(state,data){
    state.data=data
  }
}

const actions = {
  async getData({commit}) {
    let data=await mockRequest.get("/home/list")
    console.log(data)
    if(data.code===20000){
      commit("getData",data.data)
    }
  }
}

export default {
  state,
  mutations,
  actions
}

