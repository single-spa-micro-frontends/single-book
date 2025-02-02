export const fetchBooks = async (query: string) => {
    const queryString = query || "programming";
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${queryString}&maxResults=8`
    );
    const data = await res.json();
    return data.items || [];
  };