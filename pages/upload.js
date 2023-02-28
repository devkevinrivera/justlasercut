import React from 'react';
//inputImage
const upload = () => {
    return (
        <div>
            <form action="/api/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="data" />
                <button type="submit" />
            </form>
        </div>
    );
};

export default upload;