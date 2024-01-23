export interface CustomModalDTO {
  isOpen: boolean;
  onRequestClose: () => void;
  compressedImage: string | null;
  playlists: any[];
  uploadImage: string | null;
  token: string;
}
