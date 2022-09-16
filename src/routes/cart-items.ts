import e, { Router } from "express";

const routes = Router();

let items = [
    {id:0, product: "potato", price: 2.50, quantity: 30},
    {id: 1, product: "game", price: 100, quantity: 50},
    {id: 2, product: "pizza", price: 3.99, quantity: 50},
    {id: 3, product: "pot", price: 20, quantity: 15,}
];
let currentId = 4;

routes.get("/cart-items", (req, res) => {
    let tempItems = items;

    const maxPrice = Number.parseInt(req.query["maxPrice"] as string);
    const prefix = String(req.query["prefix"]);
    const pageSize = Number.parseInt(req.query["pageSize"] as string);
    

    if(maxPrice){
        tempItems = tempItems.filter((item)=>{
            if(item.price <= maxPrice){
                return item
            }
        });
    }

    if(prefix !== "undefined"){
        tempItems = tempItems.filter((item) => {
            if(item.product.startsWith(prefix)){
                return item;
            };
        });
    }
    
    if(pageSize){
        tempItems = tempItems.filter((item) =>{
            if(item.id < pageSize){
                return item;
            }
        });
    }

    res.status(200);
    res.json(tempItems)
});

routes.get("/cart-items/:id", (req, res) => {
    const id = Number.parseInt(req.params.id);

    if(id < currentId){
        res.status(200);
        const item = items.find((item) => {
            return item.id === id
        });
        res.send(item);
    } else{
        res.status(404).send();
    }
});

routes.post("/cart-items", (req, res) =>{
    const newItem = req.body;
    newItem.id = currentId;
    currentId ++;

    items.push(newItem);

    res.send(newItem);
    res.status(201);
});

routes.put("/cart-items/:id", (req, res) => {
    const id = Number.parseInt(req.params.id);

    const newItem = req.body;

    let index = items.findIndex((item) => {
        return item.id === id;
    });

    if(index >=0){
        newItem.id = id;

        items.splice(index, 1, newItem);
        res.json(newItem);
        res.status(200);
    } else {
        res.status(404).send();
    }
});

routes.delete("/cart-items/:id", (req, res) => {
    const id = Number.parseInt(req.params.id);
    const index = items.findIndex((item) => {
        return item.id === id;
    });

    if(index >= 0){
        items.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send();
    }
})
export default routes;