export default function Group() {
      return (
    //     <div class="relative overflow-x-auto">
    //     <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
    //         <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    //             <tr>
    //                 <th scope="col" class="px-6 py-3">
    //                     Block name
    //                 </th>
    //                 <th scope="col" class="px-6 py-3">
    //                     Value
    //                 </th>
    //                 <th scope="col" class="px-6 py-3">
    //                     In-Range
    //                 </th>
    //             </tr>
    //         </thead>
    //         <tbody>
    //             <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    //                 <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
    //                     Apple MacBook Pro 17"
    //                 </th>
    //                 <td class="px-6 py-4">
    //                     Silver
    //                 </td>
    //                 <td class="px-6 py-4">
    //                     Laptop
    //                 </td>
    
    //             </tr>
    //             <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    //                 <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
    //                     Microsoft Surface Pro
    //                 </th>
    //                 <td class="px-6 py-4">
    //                     White
    //                 </td>
    //                 <td class="px-6 py-4">
    //                     Laptop PC
    //                 </td>
    
    //             </tr>
    //             <tr class="bg-white dark:bg-gray-800">
    //                 <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
    //                     Magic Mouse 2
    //                 </th>
    //                 <td class="px-6 py-4">
    //                     Black
    //                 </td>
    //                 <td class="px-6 py-4">
    //                     Accessories
    //                 </td>
    
    //             </tr>
    //         </tbody>
    //     </table>
    // </div>


    
        <div className="w-full bg-gray-200  shadow-md rounded-xl flex flex-col">
            <h1 className="p-4">Group Name</h1>
    <table class="">
      <thead>
        <tr class="bg-blue-gray-100 text-gray-700">
          <th class="py-3 px-4 text-left">Block Name</th>
          <th class="py-3 px-4 text-left">Value</th>
          <th class="py-3 px-4 text-left">In-Range</th>
        </tr>
      </thead>
      <tbody class="text-blue-gray-900">
        <tr class="border-b border-blue-gray-200">
          <td class="py-3 px-4">Company A</td>
          <td class="py-3 px-4">$50.25</td>
          <td class="py-3 px-4">100</td>
        
        </tr>
        <tr class="border-b border-blue-gray-200">
          <td class="py-3 px-4">Company B</td>
          <td class="py-3 px-4">$75.60</td>
          <td class="py-3 px-4">150</td>
         
        </tr>
        <tr class="border-b border-blue-gray-200">
          <td class="py-3 px-4">Company C</td>
          <td class="py-3 px-4">$30.80</td>
          <td class="py-3 px-4">200</td>
          
        </tr>
 
       
      </tbody>
    </table>
    </div>
  
    
      )};