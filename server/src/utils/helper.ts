import fs from "fs/promises";

export const deleteLocalFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (err: any) {
    console.error(`Error deleting file: ${err.message}`);
  }
};
//
// export const deleteLocalFile = (filePath: string): void => {
//     const maxRetries = 3;
//     let attempts = 0;

//     const attemptDelete = () => {
//         try {
//             fs.unlinkSync(filePath);
//             console.log(`File deleted successfully: ${filePath}`);
//         } catch (err: any) {
//             if (err.code === 'EPERM' && attempts < maxRetries) {
//                 attempts++;
//                 console.warn(`Retrying deletion (${attempts}/${maxRetries})...`);
//                 setTimeout(attemptDelete, 1000); // Retry after 1 second
//             } else {
//                 console.error(`Error deleting file: ${err.message}`);
//             }
//         }
//     };

//     attemptDelete();
// };
