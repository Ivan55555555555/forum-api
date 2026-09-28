import postRepository from '../repositories/post.js';

class PostService {
  getPosts(category, take) {
    return postRepository.getAll(category, take);
  }

  getPostById(id) {
    const post = postRepository.getById(id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  async createPost(postData) {
    return await postRepository.addPost(postData);
  }
}

module.exports = new PostService();
