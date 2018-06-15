import React, { Component } from "react";
import { Session } from "meteor/session";
import SearchResults from "./SearchResults";
import Modal from "react-modal";

class SearchPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: "",
      isSearchReady: false
    };
  }

  _delayTimer;

  onInputChange(event) {
    this.setState(
      { searchTerm: event.target.value.trim(), isSearchReady: false },
      () => {
        this.doSearch(this.state.searchTerm);
      }
    );
  }

  doSearch(searchTerm) {
    //https://stackoverflow.com/questions/7849221/ajax-delay-for-search-on-typing-in-form-field#7849308
    clearTimeout(this._delayTimer);
    this._delayTimer = setTimeout(() => {
      if (searchTerm.length > 2) {
        this.setState({ isSearchReady: true });
      }
    }, 1500);
  }

  onFormSubmit(e) {
    e.preventDefault();
  }

  closeSearchModal() {
    Session.set("isSearchModelOpen", false);
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isSearchModelOpen}
        onRequestClose={() => this.closeSearchModal()}
        ariaHideApp={false}
        className="episode-modal"
        overlayClassName="episode-modal__overlay"
      >
        <form onSubmit={e => this.onFormSubmit(e)}>
          <input
            type="text"
            placeholder="Find podcasts"
            value={this.state.term}
            onChange={e => this.onInputChange(e)}
          />
        </form>
        {this.state.isSearchReady ? (
          <SearchResults searchTerm={this.state.searchTerm} />
        ) : null}
      </Modal>
    );
  }
}

export default SearchPopup;
