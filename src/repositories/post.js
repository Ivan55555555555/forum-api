const posts = [
    { 
        id: "0",
        title: "First Post", 
        content: "Hello World1", 
        author: "John", 
        category: "tech" 
    },
    { 
        id: "1", 
        title: "Second Post", 
        content: "Hello World2", 
        author: "Anna", 
        category: "food" 
    },
    { 
        id: "2", 
        title: "Thirst Post", 
        content: "Hello World3", 
        author: "John", 
        category: "tech" 
    }
];

class PostRepository {
  getAll(category, take) {
    let filteredPosts = [...posts];

    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    if (take) {
      const limit = parseInt(take, 10);
      if (!isNaN(limit)) {
        filteredPosts = filteredPosts.slice(0, limit);
      }
    }

    return filteredPosts;
  }

  getById(id) {
    return posts.find(post => post.id === id) || null;
  }

  addPost(postData) {
    return new Promise((resolve) => {
      const newPost = {
        id: Date.now().toString(),
        ...postData
      };
      posts.push(newPost);
      resolve(newPost);
    });
  }
}

module.exports = new PostRepository();