const priceAfterPromo = (price, promo) => {
    return (price - ((price * promo)/100))
}

export { priceAfterPromo }