import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { API_URL } from '../constans.js';
import { Link } from 'react-router-dom';
import './pages.css'



function MainPage() {
	const [dataArray, setDataArray] = useState([]);
	const [message, setMessage] = useState({}); //msg from DB

	 //fetch posts
	const fetchData = async () => {
		try {
			const res = await axios.get(`/posts`);
			setDataArray(res.data);
			console.log(res.data);
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		fetchData();
	}, []);
	const handleDeletePost = (post) => {
		if (window.confirm('Are you sure delete this post?')) {
		  deletePost(post.post_id);
		}
	 };
	const deletePost = async (post_id) => {
		axios
			.delete(`/deletepost/${post_id}`)
			.then((res) => {
				const msg = {
				msgClass: res.status === 200 ? 'success' : 'error',
				text: res.status === 200 ? 'Article deleted successfully!' : 'Error delete article',
				};
				setMessage(msg);
				// Clear the message after 2 seconds
				setTimeout(() => {
					setMessage('');
				}, 2000);
				fetchData();
				// navigate('/');
			})
			.catch((error) => {
				console.error('Error delete article', error);
			});
	};
  return (
	 <div>
		<div className="container">
			<div className="post__btns mt4">
				<Link to="newpost">new Post</Link>
			</div>
			
			<div className="posts mt4">
			{dataArray &&
            dataArray.map((elem, i) => (
              <div key={'art-' + i} className='post-prev'>
                <Link
                  to={`/post/${elem.post_id}`}
                  state={{ post: elem }}
                  className={`art__item d-flex mt4 g2 ${i % 2 === 0 && 'f-reverce'}`}>
                  <img src={`${API_URL}/${elem.post_img}`} alt='art_icon' className='art__icon' />
                  <div className='text'>
                    <h2 className='mb2'>{elem.post_title}</h2>
                  </div>
						
                </Link>
					 <button onClick={() => handleDeletePost(elem)}>
						Delete post
					</button>
					<div className='msg_block'>
						{message ? <span className={message.msgClass}>{message.text}</span> : <span></span>}
					</div>
              </div>
            ))}
			</div>
		
		</div>
	 </div>
  )
}

export default MainPage
