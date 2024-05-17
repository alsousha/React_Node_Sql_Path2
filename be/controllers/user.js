import { dbSingleton } from '../dbSingleton.js';
import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

export const getPosts = (req, res) => {
	const q = 'SELECT * FROM posts';
 
	const db = dbSingleton.getInstance();
	db.query(q, (err, data) => {
	  if (err) return res.status(500).send(err);
 
	  return res.status(200).json(data);
	});
 };

 export const createPost = (req, res) => {
  upload.single('selectedFile')(req, res, async (err) => {
    if (err) {
      console.error('Error parsing form data', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File uploaded:', file);

    try {
      const dataToSend = JSON.parse(req.body.dataToSend); 
      const date_create = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const q = `
        INSERT INTO posts (post_title, post_text, post_img, create_date)
        VALUES (?, ?, ?, ?)
      `;

      const db = dbSingleton.getInstance();
      db.query(
        q,
        [dataToSend.selectedTitle, dataToSend.selectedText, `uploads/${file.filename}`, date_create],
        (err, result) => {
          if (err) {
            console.error('Failed to create the article.', err);
            return res.status(500).json({ error: 'Error creating the article' });
          }
          res.status(200).json({ message: 'Create the article successfully!' });
        }
      );
    } catch (error) {
      console.error('Failed to create the article', error);
      res.status(500).json({ error: 'Error creating the article' });
    }
  });
};
export const editPost = (req, res) => {
	const { id } = req.params;
	try {
	  upload.single('selectedFile')(req, res, async (err) => {
		console.log('File received:', req.file);
		 if (err) {
			console.error('Error parsing form data', err);
			return res.status(500).json({ error: 'Error parsing form data' });
		 }
 
		 const dataToSend = JSON.parse(req.body.dataToSend);
		//  const id_article = req.body.id;
 
		 // Access the uploaded file
		 const file = req.file;
		 if (file) { 
  
			const q = `
			  UPDATE posts
			  SET
				post_title = ?,
				post_text = ?,
				post_img = ?
			  WHERE
				 post_id = ?
			`;
			const db = dbSingleton.getInstance();
			db.query(
			  q,
			  [dataToSend.selectedTitle, dataToSend.selectedText, `uploads/${file.filename}`, id],
			  (err, result) => {
				 if (err) {
					console.error('Failed to edit the article.', err);
					res.status(500).json({ error: 'Error editing the article' });
				 } else {
					res.status(200).json({ message: 'Article edited successfully!' });
				 }
			  },
			);
		 } else {
			console.log(dataToSend);
 
			// No file uploaded, update the task without modifying the image
			const q = `
					 UPDATE posts
					 SET
						post_title = ?,
						post_text = ?,
						post_img = ?
					 WHERE
					 	post_id = ?
						 
				 `;
			const db = dbSingleton.getInstance();
			db.query(
			  q,
			  [dataToSend.selectedTitle, dataToSend.selectedText, dataToSend.selectedImage, id],
			  (err, result) => {
				 if (err) {
					console.error('Failed to edit the article.', err);
					res.status(500).json({ error: 'Error editing the article' });
				 } else {
					res.status(200).json({ message: 'Article edited successfully!' });
				 }
			  },
			);
		 }
	  });
	} catch (error) {
	  console.error('Failed to create the article', error);
	  res.status(500).json({ error: 'Error creating the article' });
	}
 };
export const deletePost = (req, res) => {
// Delete the article
try {
	const { id } = req.params;
	const q = 'DELETE FROM posts WHERE post_id = ?';
	// console.log(id);
	const db = dbSingleton.getInstance();
	db.query(q, id, (err) => {
		if (err) {
		console.error('Error deleting article:', err);
		return res.status(500).json('Failed to delete the article.');
		} else {
		return res.status(200).json('Article deleted successfully!');
		}
	});
} catch (error) {
	console.error('Error deleting article:', err);
}
};