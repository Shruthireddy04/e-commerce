import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusCode = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    status: 'INITIAL',
    activeOptionId: sortbyOptions[0].optionId,
    search: '',
    category: '',
    rating: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  onChangeInput = e => {
    this.setState({search: e.target.value})
    this.getProducts()
  }

  categoryChange = categoryId => {
    const cat = categoryOptions.find(i => i.name === categoryId)
    this.setState({category: cat.categoryId})
    this.getProducts()
  }

  ratingChange = ratingId => {
    this.setState({rating: ratingId})
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      status: apiStatusCode.loading,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, search, category, rating} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${search}&category=${category}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        status: apiStatusCode.success,
      })
    } else {
      this.setState({
        status: apiStatusCode.failure,
      })
    }
  }

  clearFilter = () => {
    this.setState({
      activeOptionId: sortbyOptions[0].optionId,
      search: '',
      category: '',
      rating: '',
    })
    this.getProducts()
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    if (productsList.length === 0) {
      return (
        <div className="all-products-container">
          <img
            className="all-products-container1"
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
            alt="no products"
          />
        </div>
      )
    }
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view
  renderFailure = () => (
    <div className="products-loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
    </div>
  )

  render() {
    const {status, search} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <div>
          <input
            value={search}
            type="search"
            className="searchInput"
            onChange={this.onChangeInput}
            placeholder="Search"
          />
          <p className="filter-heading">Category</p>
          {categoryOptions.map(i => (
            <FiltersGroup
              key={i.categoryId}
              category={i}
              categoryChange={this.categoryChange}
              ratingChange={this.ratingChange}
            />
          ))}
          <p className="filter-heading">Rating</p>
          {ratingsList.map(i => (
            <FiltersGroup
              ratingChange={this.ratingChange}
              key={i.ratingId}
              category={i}
              rating
              categoryChange={this.categoryChange}
            />
          ))}
          <button
            type="button"
            className="clear-filter-btn"
            onClick={this.clearFilter}
          >
            Clear Filters
          </button>
        </div>

        {status === apiStatusCode.loading ? this.renderLoader() : null}
        {status === apiStatusCode.success ? this.renderProductsList() : null}
        {status === apiStatusCode.failure ? this.renderFailure() : null}
      </div>
    )
  }
}

export default AllProductsSection
