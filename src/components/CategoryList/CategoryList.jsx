import CategoryCard from "../categoryCard/CategoryCard";
import "./CategoryList.css";

const CategoryList = ({
  categories = [],
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="category-list__loading">
        <p>Carregando categorias...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="category-list__empty">
        <div className="category-list__empty-content">
          <h3>Nenhuma categoria encontrada</h3>
          <p>
            Crie sua primeira categoria para começar a organizar seus gastos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-list">
      <div className="category-list__grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
