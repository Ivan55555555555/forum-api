import { Header } from './components/Header.tsx';
import { PostList } from './components/PostList.tsx';
import { staticPosts } from './data/posts.js';
import './App.css';

function App() {
  return (
    <main className="app-container">
      <Header 
        title="Forum API Community" 
        description="Forum API Description" 
      />
      <section className="main-content">
        <PostList posts={staticPosts} />
      </section>
    </main>
  );
}

export default App;
