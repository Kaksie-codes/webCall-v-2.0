const PaginatedGridLayout = ({ numChildren }: { numChildren: number }) => {
    // Define the grid classes based on the number of children
    let gridClasses;
    let itemHeightClasses;
    switch (numChildren) {
      case 1:
        gridClasses = "grid-cols-1";
        itemHeightClasses = "h-full";
        break;
      case 2:
        gridClasses = "grid-cols-2";
        itemHeightClasses = "h-1/2";
        break;
      case 3:
        gridClasses = "grid-cols-3";
        itemHeightClasses = "h-1/3"; // Height divided equally into thirds
        break;
      default:
        gridClasses = "grid-cols-4 min-h-[250px] h-1/4"; // You can adjust this default value based on your needs
        itemHeightClasses = "h-full"; // Height divided equally into quarters
        break;
    }
  
    return (
      <div className="flex justify-center items-center h-screen w-full">    
        <div className={`grid w-full pla h-[fitcontent] bg-yellow-100 gap-1 ${gridClasses}`}>
          {[...Array(numChildren).keys()].map((index) => (
            <div key={index} className={`bg-red ${itemHeightClasses}`}></div>
          ))}
        </div>
      </div>
    );
  };
  
  export default PaginatedGridLayout;
  