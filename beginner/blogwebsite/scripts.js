let currentPage = 1;
const postsPerPage = 3;
const posts = [
  { title: 'Post 1', content: 'Content for post 1...', category: 'Technology' },
  { title: 'Post 2', content: 'Content for post 2...', category: 'Lifestyle' },
  { title: 'Post 3', content: 'Content for post 3...', category: 'Travel' },
  { title: 'Post 4', content: 'Content for post 4...', category: 'Health' },
  { title: 'Post 5', content: 'Content for post 5...', category: 'Food' },
  { title: 'Post 6', content: 'Content for post 6...', category: 'Business' },
];

let username = localStorage.getItem('username');

if (!username) {
  username = prompt('Enter your name to comment:');
  localStorage.setItem('username', username);
}

function displayPosts() {
  const start = (currentPage - 1) * postsPerPage;
  const end = currentPage * postsPerPage;
  const postsToDisplay = posts.slice(start, end);

  const postsContainer = document.querySelector('.blog-posts');
  postsContainer.innerHTML = '';

  postsToDisplay.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <p><strong>Category:</strong> ${post.category}</p>
      <button class="like-btn" onclick="likePost(${posts.indexOf(post) + 1})">Like</button>
      <p id="likes-count-${posts.indexOf(post) + 1}">0 Likes</p>
    `;
    postsContainer.appendChild(postElement);
  });
}

function changePage(direction) {
  currentPage += direction;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > Math.ceil(posts.length / postsPerPage)) {
    currentPage = Math.ceil(posts.length / postsPerPage);
  }
  displayPosts();
}

function likePost(postId) {
  const likesElement = document.getElementById(`likes-count-${postId}`);
  let likes = parseInt(likesElement.textContent);
  likes += 1;
  likesElement.textContent = `${likes} Likes`;
}

function addComment() {
  const commentInput = document.getElementById('comment-input');
  const commentText = commentInput.value.trim();
  if (commentText) {
    const commentList = document.getElementById('comments-list');
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.innerHTML = `<strong>${username}:</strong> ${commentText}`;
    commentList.appendChild(commentElement);
    saveComments();
    commentInput.value = '';
  } else {
    alert('Please enter a comment.');
  }
}

function saveComments() {
  const comments = [];
  document.querySelectorAll('.comment').forEach(commentElement => {
    comments.push(commentElement.textContent);
  });
  localStorage.setItem('comments', JSON.stringify(comments));
}

function loadComments() {
  const storedComments = JSON.parse(localStorage.getItem('comments'));
  if (storedComments) {
    storedComments.forEach(commentText => {
      const commentElement = document.createElement('div');
      commentElement.classList.add('comment');
      commentElement.textContent = commentText;
      document.getElementById('comments-list').appendChild(commentElement);
    });
  }
}

window.onload = function() {
  loadComments();
  displayPosts();
};

document.getElementById('image-upload').addEventListener('change', function(e) {
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = new Image();
    img.src = event.target.result;
    document.querySelector('.blog-posts').appendChild(img);
  };
  reader.readAsDataURL(e.target.files[0]);
});

window.onscroll = function() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    document.getElementById("scrollToTopBtn").style.display = "block";
  } else {
    document.getElementById("scrollToTopBtn").style.display = "none";
  }
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
