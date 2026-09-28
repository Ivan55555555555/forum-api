import postService from '../services/post.js';

class PostHandler {
  getPosts(req, res) {
    try {
      const { category, take } = req.query;
      
      if (take && (isNaN(parseInt(take, 10)) || parseInt(take, 10) <= 0)) {
        return res.status(400).json({ error: 'Parameter "take" must be a positive number' });
      }

      const posts = postService.getPosts(category, take);
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  getPostById(req, res) {
    try {
      const { id } = req.params;

      if (!id || id.trim() === '') {
        return res.status(400).json({ error: 'ID parameter is required' });
      }

      const post = postService.getPostById(id);
      return res.status(200).json(post);
    } catch (error) {
      if (error.message === 'Post not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async createPost(req, res) {
    try {
      const { title, content, author, category } = req.body;

      if (!title || !content || !author || !category) {
        return res.status(400).json({ 
          error: 'Fields validation failed. title, content, author, and category are required' 
        });
      }

      const newPost = await postService.createPost({ title, content, author, category });
      return res.status(201).json(newPost);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PostHandler();
