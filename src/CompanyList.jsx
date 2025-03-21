import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./company-list.css";

const CompanyList = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    // Load companies from localStorage
    const loadCompanies = () => {
      setLoading(true);
      const companiesJson = localStorage.getItem('companies');
      if (companiesJson) {
        const loadedCompanies = JSON.parse(companiesJson);
        setCompanies(loadedCompanies);
      }
      setLoading(false);
    };

    loadCompanies();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const formatDomain = (domain) => {
    return domain.startsWith('http') ? domain : `https://${domain.toLowerCase()}`;
  };

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Filter and sort companies
  const filteredAndSortedCompanies = companies
    .filter(company => {
      // Filter by category
      const categoryMatch = filter === "all" || company.companyCategory === filter;
      
      // Filter by search term
      const searchMatch = 
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      // Sort by selected field
      let comparison = 0;
      
      switch(sortBy) {
        case "name":
          comparison = a.companyName.localeCompare(b.companyName);
          break;
        case "category":
          comparison = a.companyCategory.localeCompare(b.companyCategory);
          break;
        case "date":
          comparison = new Date(a.JDdate) - new Date(b.JDdate);
          break;
        default:
          comparison = 0;
      }
      
      // Apply sort order
      return sortOrder === "asc" ? comparison : -comparison;
    });

  return (
    <div className="company-list-container">
      <div className="list-header">
        <h1>Company Directory</h1>
        <p className="list-description">Browse and search through all companies in our database</p>
      </div>
      
      <div className="filters-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={filter}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="Service Based">Service Based</option>
              <option value="Product Based">Product Based</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={handleSortChange}
              className="filter-select"
            >
              <option value="name">Company Name</option>
              <option value="category">Category</option>
              <option value="date">JD Date</option>
            </select>
            
            <button onClick={toggleSortOrder} className="sort-order-btn">
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="results-info">
        <span className="company-count">
          Showing {filteredAndSortedCompanies.length} of {companies.length} companies
        </span>
        <button className="add-new-btn" onClick={() => navigate('/create')}>
          Add New Company
        </button>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading companies...</p>
        </div>
      ) : (
        <>
          {filteredAndSortedCompanies.length > 0 ? (
            <div className="company-cards">
              {filteredAndSortedCompanies.map((company) => (
                <div key={company.id} className="company-card">
                  <div className="company-card-header">
                    <h2 className="company-name">{company.companyName}</h2>
                    <span className={`category-tag ${company.companyCategory === "Service Based" ? "service" : "product"}`}>
                      {company.companyCategory}
                    </span>
                  </div>
                  
                  <div className="company-details">
                    <div className="detail-item">
                      <span className="detail-icon">🌐</span>
                      <a 
                        href={formatDomain(company.domain)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="website-link"
                      >
                        {company.domain}
                      </a>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">
                        {formatDate(company.JDdate)}
                      </span>
                    </div>
                    
                    {company.description && (
                      <div className="company-description">
                        <p>{company.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="edit-button" 
                      onClick={() => {
                        // Store selected company ID in session storage
                        sessionStorage.setItem('selectedCompanyId', company.id);
                        navigate('/edit');
                      }}
                    >
                      Edit
                    </button>
                    <a 
                      href={formatDomain(company.domain)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="visit-button"
                    >
                      Visit Site
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No companies found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button onClick={() => {
                setSearchTerm("");
                setFilter("all");
              }} className="reset-filters-btn">
                Reset Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompanyList;