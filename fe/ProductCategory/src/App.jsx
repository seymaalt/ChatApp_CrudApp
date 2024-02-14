import ProductTable from './components/ProductTable';
import Chat from './components/Chat';
import CategoryTable from './components/CategoryTable';
function App() {
 
  return (
    <div style={{padding:"15px"}}>
     <ProductTable style={{}}></ProductTable>
     <div style={{marginTop:"20px"}}>
     <CategoryTable ></CategoryTable>
     </div>
     <Chat></Chat>
    </div>
  )
}

export default App
