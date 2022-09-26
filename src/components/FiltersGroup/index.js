import './index.css'

const FiltersGroup = props => {
  const {category, rating, categoryChange, ratingChange} = props
  const onClickCategory = () => {
    categoryChange(category.name)
  }
  const onClickRating = () => {
    ratingChange(category.ratingId)
  }

  return (
    <div className="filters-group-container">
      {rating && (
        <p className="category-name" onClick={onClickRating}>
          <img className="rating-img" src={category.imageUrl} alt="rating" />{' '}
          &up
        </p>
      )}
      {!rating && (
        <p className="category-name" onClick={onClickCategory}>
          {category.name}
        </p>
      )}
    </div>
  )
}

export default FiltersGroup
