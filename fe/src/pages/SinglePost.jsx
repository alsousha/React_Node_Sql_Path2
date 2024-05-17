import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { API_URL } from '../constans';
import { ReactComponent as EditIcon } from '../assets/img/edit3.svg';
import { ReactComponent as BackIcon } from '../assets/img/back.svg';

import ReactQuill from 'react-quill';


function SinglePost() {
	const location = useLocation();
	//get post data from MainPage
	const item = location.state?.post;
	console.log(item);
  return (
	<div className="container">
		<div className='post'>
			<div className='back__btn mt2'>
				<Link className='d-flex aic g1' to='/'>
					<BackIcon />
					<span>Go Back</span>
				</Link>
			</div>
			<div className="mt2">
				<Link
						className="d-flex aic ml03"
						to={`/editpost/${item.post_id}`}
						state={{ item: item }}
					>	
					<EditIcon/> Edit Post
				</Link>
			</div>
			
			<div className="post__details">
				<img src={`${API_URL}/${item.post_img}`} alt='art_icon' className='art__icon' />
				<div className='text'>
					<h2 className='mb2'>{item.post_title}</h2>
					<div className="post_text">
						<ReactQuill
							value={item.post_text}
							readOnly={true}
							theme={"bubble"}
						/>
					</div>
				</div>
			</div>
			
		</div>
	</div>
	 
  )
}

export default SinglePost
