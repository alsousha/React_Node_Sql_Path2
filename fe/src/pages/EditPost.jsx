import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill styles
import { API_URL } from '../constans.js';
import { ReactComponent as BackIcon } from '../assets/img/back.svg';
import axios from 'axios'

function EditPost() {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams(); // id post
  const location = useLocation();
  const post = location.state?.item; //get post data from SinglePost (<Link/>)
  // console.log(post);
  //errors
  const [message, setMessage] = useState({}); //msg from DB

  const [selectedData, setSelectedData] = useState({
    selectedTitle: '',
    selectedText: '',
    selectedFile: ''
  });
  const [imagePreview, setImagePreview] = useState(''); //thumb

  useEffect(() => {
    const postObj = {
      selectedTitle: post.post_title,
      selectedText: post.post_text,
      selectedImage: post.post_img,
    }
    setSelectedData(postObj)
    setImagePreview(`${API_URL}/${post.post_img}`)
  }, []);

  const handleTitleChange = (event) => {
    setSelectedData((prevData) => ({
      ...prevData,
      selectedTitle: event.target.value,
    }));
  };

  const handleTextChange = (val) => {
    setSelectedData((prevData) => ({
      ...prevData,
      selectedText: val,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const msg = {
      msgClass: '',
      text: '',
    };
    setMessage(msg);

    // Check if a valid file is selected
    if (!file || !file.type.startsWith('image/')) {
      msg.msgClass = 'error';
      msg.text = 'Incorrect type of image file.';
      setMessage(msg);
      return;
    }

    //need to control of loading file
    setSelectedData((prevData) => ({
      ...prevData,
      selectedFile: event.target.files[0],
    }));
    // Create a file reader for thumb
    const reader = new FileReader();
    // Set up the file reader onload event
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    // Read the image file as a data URL
    reader.readAsDataURL(file);
  };

  const handleSaveData = () => {
    const msgValidation = validateField() //check inputs
    if (msgValidation.msgClass === 'error') {
      setMessage(msgValidation)
      setTimeout(() => {
        setMessage('');
      }, 2000);
    } else {		
      updatePost()
    }
  };

  const validateField = () => {
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];

    //clear prev error msg
    const msg = {
      msgClass: '',
      text: ''
    }
    //check title
    if (selectedData.selectedTitle === '') {
      msg.msgClass = 'error';
      msg.text = 'Post\'s name is required'
    } else if (selectedData.selectedText === '') {
      msg.msgClass = 'error';
      msg.text = 'Text is required'
    } else if (!selectedData && !allowedFormats.includes(selectedData.selectedFile.type)) {
      msg.msgClass = 'error';
      msg.text = 'Incorrect type of image file.'
    }
    return msg;
  }

  //axios for DB
  const updatePost = async () => {
    const formData = new FormData();
    formData.append('dataToSend', JSON.stringify(selectedData));
	 formData.append('selectedFile', selectedData.selectedFile);

    axios
      .post(`/updatepost/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
        },
      })
      .then((res) => {
        const msgText = "Update the post successfully!"
        const msg = {
          msgClass: res.status === 200 ? "success" : "error",
          text: res.status === 200 ? msgText : 'Error updating post'
        }
        setMessage(msg);
      // Clear the message after 2 seconds 
        setTimeout(() => {
          setMessage('');
			 navigate("/")
        }, 2000);
      })
      .catch((error) => {
        console.error('Error updating post', error);
      });
  }
  return (
    <div className='container'>
      <h2 className='mt4'>Edit Post</h2>
      <div className='back__btn mt2'>
        <Link className='d-flex aic g1' to='/'>
          <BackIcon />
          <span>Go Back</span>
        </Link>
      </div>

      <div className='post_data mt4'>
        {/* article title */}
        <div className='post_data-item'>
          <span className='label'>Post's title:</span>
          <input
            type='text'
            name='name'
            value={selectedData.selectedTitle}
            ref={inputRef}
            onChange={handleTitleChange}
          />
        </div>
        {/* img */}
        <div className='post_data-group mt3'>
          <div className='post_data-item'>
            <span className='label'>Post's image:</span>
            <input type='file' onChange={handleFileChange} />
            <div className="post__thumb w509">
				{imagePreview && <img src={imagePreview} alt='Image Preview' />}
            </div>
          </div>
        </div>
        {/* article text */}
        <div className='editorContainer art mt3'>
          {selectedData && <ReactQuill
            theme='snow'
            value={selectedData.selectedText}
            onChange={(e) => handleTextChange(e)}
          />}
        </div>
      </div>
      <button
        className='btn_form mt2'
        onClick={handleSaveData}>
        Update Post
      </button>
      <div className='msg_block'>
        {message ? <span className={message.msgClass}>{message.text}</span> : <span></span>}
      </div>
    </div>
  )
}

export default EditPost;
