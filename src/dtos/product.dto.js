export class ProductDTO {
  constructor(product) {
    this.id = product._id || product.id;
    this.title = product.title;
    this.description = product.description;
    this.code = product.code;
    this.price = product.price;
    this.stock = product.stock;
    this.category = product.category;
    this.thumbnails = product.thumbnails || [];
    this.status = product.status !== undefined ? product.status : true;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}

export class ProductListDTO {
  constructor(paginatedResult) {
    this.payload = paginatedResult.payload.map(p => new ProductDTO(p));
    this.totalPages = paginatedResult.totalPages;
    this.currentPage = paginatedResult.currentPage; 
    this.hasNextPage = paginatedResult.hasNextPage;
    this.hasPrevPage = paginatedResult.hasPrevPage;
    this.nextPage = paginatedResult.nextPage;
    this.prevPage = paginatedResult.prevPage;
  }
}