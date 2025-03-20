import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      onSearch(query.trim());
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex justify-content-center my-4">
      <InputGroup style={{ maxWidth: "600px", width: "100%" }}>
        <Form.Control
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="shadow-sm"
        />
        <Button type="submit" variant="primary">
          Search
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBar;