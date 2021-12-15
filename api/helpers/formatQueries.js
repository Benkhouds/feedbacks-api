function formatSort(sortField) {
   if (sortField) {
      if (sortField[0] === '-') {
         return {
            $sort: {
               [sortField.slice(1)]: -1,
               createdAt: -1,
            },
         };
      } else {
         return {
            $sort: {
               [sortField]: 1,
               createdAt: -1,
            },
         };
      }
   }

   return {
      $sort: {
         createdAt: -1,
      },
   };
}

export { formatSort };
