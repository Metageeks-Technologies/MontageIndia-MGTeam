
import fs from 'fs';

export const deleteLocalFile = (filePath: string): void => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err.message}`);
        } else {
            console.log(`File deleted successfully: ${filePath}`);
        }
    });
};