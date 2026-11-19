import React, { useState } from 'react';

const ApplicationSearch = () => {
      const [page, setPage] = useState(1);
        const [search, setSearch] = useState("");
    return (
              {/* Search */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search applications..."
          className="pl-8"
        />
      </div>
    );
};

export default ApplicationSearch;