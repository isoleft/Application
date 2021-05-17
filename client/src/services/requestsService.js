import api from '@/services/api'

export default {
  fetchPosts () {
    return api().get('plans')
  },
  addNewPost (params) {
    return api().post('plans', params)
  },
  deletePost (id) {
    return api().delete(`plans/${id}`)
  },
  updatePost (params) {
    return api().put(`plans/${params.id}`, params)
  }
}
