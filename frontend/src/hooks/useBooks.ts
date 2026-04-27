import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import type { Book } from "../types";

export function useBooks() {
  const [searchParams] = useSearchParams();

  const [draftSearch, setDraftSearch] = useState(
    searchParams.get("search") ?? "",
  );
  const [draftGenre, setDraftGenre] = useState("");
  const [draftNote, setDraftNote] = useState(0);

  const [appliedSearch, setAppliedSearch] = useState(
    searchParams.get("search") ?? "",
  );
  const [appliedGenre, setAppliedGenre] = useState("");
  const [appliedNote, setAppliedNote] = useState(0);
  const [page, setPage] = useState(1);

  const [books, setBooks] = useState<Book[]>([]);
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch("/books?limit=100")
      .then((res) => {
        const genres = [
          ...new Set(
            (res.data ?? []).flatMap((book: Book) =>
              book.genres.map((genre) => genre.name),
            ),
          ),
        ] as string[];
        setAllGenres(genres.sort());
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const searchQuery = searchParams.get("search") ?? "";
    setDraftSearch(searchQuery);
    setAppliedSearch(searchQuery);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const run = async () => {
      let results: Book[] = [];
      let pages = 1;

      if (appliedSearch.trim()) {
        const res = await apiFetch(
          `/books/search?q=${encodeURIComponent(appliedSearch.trim())}`,
        );
        results = res.data ?? [];
        if (appliedGenre)
          results = results.filter((book) =>
            book.genres.some((genre) => genre.name === appliedGenre),
          );
      } else {
        const params = new URLSearchParams({ page: String(page), limit: "12" });
        if (appliedGenre) params.set("genre", appliedGenre);
        const res = await apiFetch(`/books?${params}`);
        results = res.data ?? [];
        pages = res.pagination?.totalPages ?? 1;
      }

      if (appliedNote > 0) {
        results = results.filter(
          (book) => (book.average_rating ?? 0) >= appliedNote,
        );
      }

      setBooks(results);
      setTotalPages(pages);
    };

    run()
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, [appliedSearch, appliedGenre, appliedNote, page]);

  function handleFilter(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedSearch(draftSearch);
    setAppliedGenre(draftGenre);
    setAppliedNote(draftNote);
    setPage(1);
  }

  const featured = books[0];
  const rest = books.slice(1);

  return {
    draftSearch,
    setDraftSearch,
    draftGenre,
    setDraftGenre,
    draftNote,
    setDraftNote,
    allGenres,
    totalPages,
    loading,
    featured,
    rest,
    page,
    setPage,
    appliedSearch,
    handleFilter,
  };
}
