export interface Title {
    value?: string;
}

export interface Author {
    value?: string;
}

export interface Song {
    publicId?: string;
    title?: Title;
    author?: Author;
}

export interface SaveSong extends Song {
    file?: File;
    fileContentType?: string;
    cover?: File;
    coverContentType?: string;
}

export interface ReadSong extends Song {
    cover?: string;
    coverContentType?: string;
    favorite: boolean;
    displayPlay: boolean;
}

export interface SongContent extends ReadSong {
    file?: string;
    fileContentType?: string;
}