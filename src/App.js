import React from 'react';
import Bookshelf from './Bookshelf';
import Search from './Search';
import $ from 'jquery';
import SearchResults from './SearchResults'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      isSearch: false,
      searchResults: [],
    }

    this.handleSearch = this.handleSearch.bind(this);
    this.updateBooks = this.updateBooks.bind(this);
    this.noResult = this.noResult.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.fetch();
  }

  handleSearch(title, author) {
    $.ajax({
      url: '/bookSearch',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({title, author}),
      success: (data) => {
        console.log('successful AJAX SEARCH', data);
        const parsed = JSON.parse(data);
        this.setState({isSearch: !this.state.isSearch, searchResults: parsed});
      },
      error: (err) => {
        console.log('error in AJAX post', err);
      }
    });
  }

  updateBooks(data) {
    $.ajax({
      url: '/books',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: (data) => {
        console.log('successful AJAX post', data);
        const parsed = JSON.parse(data);
        const newArr = this.state.books.slice();
        newArr.push(parsed);
        this.setState({books: newArr});
      },
      error: (err) => {
        console.log('error in AJAX post', err);
      }
    });
  }

  noResult() {
    this.setState({inSearch: !this.state.inSearch});
  }

  fetch() {
    $.ajax({
      url: '/books',
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        console.log('successful AJAX GET', data);
        const parsed = JSON.parse(data);
        this.setState({books: parsed});
      },
      error: (err) => {
        console.log('error in AJAX GET', err);
      }
    });
  }

  handleSelect(data) {
    console.log('selected', data);
    this.setState({isSearch: !this.state.isSearch});
    this.updateBooks(data);
  }

  render() {
    return (
      <div>
        <div className='search'>
          <Search onClick={this.handleSearch}/>
          <SearchResults onClick={this.handleSelect} visible={this.state.isSearch}
            data={this.state.searchResults} noResult={this.noResult}/>
        </div>
        <div className='bookshelf'>
          <Bookshelf books={this.state.books}/>
        </div>
      </div>
    );
  }
}



export default App;
