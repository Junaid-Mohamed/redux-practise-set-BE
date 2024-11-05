const express = require("express");
const cors = require("cors");
const app = express();

const { initializeDatabase } = require("./db/db");
const { Books } = require("./models/books.model");
const { Movies } = require("./models/movies.model");


app.use(cors());
app.use(express.json());

initializeDatabase();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/books", async (req, res) => {
  try {
    const allbooks = await Books.find();
    res.json(allbooks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/books", async (req, res) => {
  const { bookName, author, genre } = req.body;

  try {
    const bookData = new Books({ bookName, author, genre });
    await bookData.save();
    res.status(201).json(bookData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/books/:id", async (req,res)=>{
  const id = req.params.id;
  const bookToUpdate = req.body;
  try{
    const updatedBook = await Books.findByIdAndUpdate(id, bookToUpdate, {new:true});
    res.status(200).json(updatedBook);
  }catch(error){
    res.status(500).json({error:error.message})
  }
})

app.delete("/books/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const deletedBook = await Books.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" , error: error.message});
  }
});

//  movies 

app.get("/movies", async (req, res) => {
  try {
    const allMovies = await Movies.find();
    res.json(allMovies);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/movies", async (req, res) => {
  const { title, director, genre, releaseYear, rating } = req.body;

  try {
    const movieData = new Movies({ title, director, genre, releaseYear, rating });
    await movieData.save();
    res.status(201).json(movieData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/movies/:id", async (req,res)=>{
  const id = req.params.id;
  const movieToUpdate = req.body;
  try{
    const updatedMovie = await Movies.findByIdAndUpdate(id, movieToUpdate, {new:true});
    res.status(200).json(updatedMovie);
  }catch(error){
    res.status(500).json({error:error.message})
  }
})

app.delete("/movies/:id", async (req, res) => {
  const movieId = req.params.id;

  try {
    const deletedMovie = await Movies.findByIdAndDelete(movieId);

    if (!deletedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.status(200).json({
      message: "Movie deleted successfully",
      movie: deletedMovie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" , error: error.message});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
