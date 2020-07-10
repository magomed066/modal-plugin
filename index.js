let fruits = [
    {id: 1, title: 'Яблоки', price: 20, img: 'https://lh3.googleusercontent.com/proxy/lDnyWhKxkh130_q1GD3OpsJ0mwLqrtbAmX-EtklpTasCmPsosw94hWY8f7zPzVcEx49mrQlN0n423BlvyceJcR6AwB32wGwsy9Hq0ENoZKVudA'},
    {id: 2, title: 'Апельсины', price: 30, img: 'https://befreshcorp.net/wp-content/uploads/2017/07/product-packshot-Orange-558x600.jpg'},
    {id: 3, title: 'Манго', price: 40, img: 'https://www.prismamarket.ru/upload/iblock/627/200004090001_mango.jpeg'}
]

const cardContainer = document.querySelector('.cards')

const modalPrice = $.modal({
    title: 'Цена на товар',
    closable: true,
    width: '400px',
    footerButtons: [
        {
            text: 'Закрыть',
            type: 'danger',
            handler() {
                modalPrice.close()
            },
        }
    ]
})

const toHTML = fruit => `
        <div class="col-4">
            <div class="card">
                <img src="${fruit.img}" class="card-img-top" style="width: 300px; height: 300px">
                <div class="card-body">
                   <h5 class="card-title">${fruit.title}</h5>
                   <a href="#" class="btn btn-primary btn-price" data-id="${fruit.id}" data-btn="price">Узнать цену</a>
                   <a href="#" class="btn btn-danger" data-id="${fruit.id}" data-btn="remove">Удалить</a>
                </div>
            </div>
        </div>
`

function render() {
    const html = fruits.map(toHTML).join('')
    cardContainer.innerHTML = html
}

render()

cardContainer.addEventListener('click', e => {
    e.preventDefault()
    const target = e.target
    const id = +target.getAttribute('data-id')
    const fruit = fruits.find(f => f.id === id)

    if (target.getAttribute('data-btn') === 'price') {
        modalPrice.setContent(`
            <h3>Цена на ${fruit.title}: ${fruit.price}₽</h3>   
        `)
        modalPrice.open()
    }

    if (target.getAttribute('data-btn') === 'remove') {
        $.confirm({
            title: 'Вы уверены?',
            content: `
                <h4>Уверены, что хотите удалить фрукт ${fruit.title}?</h4>
            `
        })
            .then(() => {
                fruits = fruits.filter(f => f.id !== id)
                render()
            })
            .catch(() => {
                console.log('Cancel')
            })
    }
})
