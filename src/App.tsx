import { useState, useEffect, useCallback } from "react";
import Button from "./components/Button";
import artOfCoding from "./assets/artOfCoding.jpg";

const App = () => {
  const [selectedBook, setSelectedBook] = useState(null);

  const [book, setBook] = useState({
    title: "",
    author: "",
    price: 0,
    description: "",
    publisher: "",
    publicationDate: "",
    language: "",
    pageCount: 0,
    images: [],
  });

  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const selectedBookSub = window.eventBus.selectedBookState$.subscribe(
      (state: any) => {
        setSelectedBook(state.book);
      }
    );

    return () => selectedBookSub.unsubscribe();
  }, []);

  const fetchBookDetails = useCallback(async (bookId: number) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${bookId}`
      );
      const data = await response.json();
      const volumeInfo = data.volumeInfo;

      const bookData = {
        id: data.id,
        title: volumeInfo.title,
        author: volumeInfo.authors?.join(", ") || "Unknown Author",
        price: (data.saleInfo?.listPrice?.amount || 12.49).toFixed(2),
        description:
          parseHTMLtoText(volumeInfo.description)
            .substring(0, 500)
            .concat("...") || "No description available.",
        publisher: volumeInfo.publisher || "Unknown Publisher",
        publicationDate: volumeInfo.publishedDate || "Unknown Date",
        language: volumeInfo.language || "Unknown Language",
        pageCount: volumeInfo.pageCount || "N/A",
        images: [
          volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150",
          volumeInfo.imageLinks?.smallThumbnail ||
            "https://via.placeholder.com/150",
        ],
      };

      setBook(bookData);
      setMainImage(bookData.images[0]);
      setQuantity(1);
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  }, []);

  const parseHTMLtoText = (htmlString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent.trim();
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  const handleAddToCart = () => {
    const data = {
      title: book.title,
      image: book.images[0],
      bookId: book.id,
      quantity: quantity,
    };

    (window as any).eventBus.addToCart(data);
  };

  useEffect(() => {
    if (selectedBook) {
      fetchBookDetails(selectedBook);
    }
  }, [selectedBook, fetchBookDetails]);

  return (
    <div className="flex w-full h-full items-center justify-center">
      {/* Placeholder View */}
      {!book.title && (
        <div className="flex flex-col items-center justify-center gap-4 p-8 w-4/5 text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg">
          <h1 className="text-4xl font-bold">Welcome to B-World!</h1>
          <p className="text-lg">
            Check out our latest collection of books. Here&apos;s a featured
            title for you!
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Featured Book */}
            <div className="flex flex-col items-center w-full">
              <img
                src={artOfCoding}
                alt="Featured Book Cover"
                className="w-52 h-full object-cover rounded-lg shadow-md"
              />
              {/* <artOfCoding> </artOfCoding> */}
              <h2 className="text-2xl font-semibold mt-4">The Art of Coding</h2>
              <p className="text-sm">
                Mohammad Majid al-Rifaie, Anna Ursyn, Theodor Wyeld
              </p>
            </div>
            <div className="flex flex-col text-left">
              <p className="text-xl font-medium">Price: $24.99</p>
              <p className="">
                Discover the secrets to becoming a coding expert. This book
                offers insights and practical advice for all levels, whether
                you&apos;re a beginner just starting your programming journey or
                an experienced developer looking to refine your skills. Dive
                into real-world examples, step-by-step tutorials, and expert
                tips that will guide you through mastering key concepts, writing
                clean code, and solving complex problems efficiently.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Book Details View */}
      {book.title && (
        <div className="flex gap-8 p-8 w-4/5">
          {/* Left Column: Thumbnails */}
          <div className="flex flex-col gap-4 w-20">
            {book.images.map((image, index) => (
              <div
                key={index}
                className="cursor-pointer border-2 border-transparent hover:border-gray-300"
                onClick={() => handleThumbnailClick(image)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Center Column: Main Image */}
          <div className="flex justify-center">
            <img
              src={mainImage}
              alt="Main Book Cover"
              className="w-64 object-contain"
            />
          </div>

          {/* Right Column: Book Details */}
          <div className="flex flex-col gap-6 flex-1">
            <div className="text-2xl font-bold">{book.title}</div>
            <div className="text-md text-gray-400">By {book.author}</div>
            <div className="text-xl font-semibold">${book.price}</div>
            <div className="text-gray-600">{book.description}</div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="text-gray-700">
                  Quantity:
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  min="1"
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-16 p-2 border border-gray-300"
                />
              </div>
              <div className="flex gap-4 w-2/5">
                <Button onClick={handleAddToCart} variant="primary">
                  Add to cart
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600 flex flex-row gap-6">
              <div>
                <strong className="text-purple-400">Publisher:</strong>{" "}
                {book.publisher}
              </div>
              <div>
                <strong className="text-purple-400">Publication Date:</strong>{" "}
                {book.publicationDate}
              </div>
              <div>
                <strong className="text-purple-400">Language:</strong>{" "}
                {book.language}
              </div>
              <div>
                <strong className="text-purple-400">Length:</strong>{" "}
                {book.pageCount} pages
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
