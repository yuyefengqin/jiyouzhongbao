import { Search, Menu, UserCircle, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  showSearch?: boolean;
  showProfile?: boolean;
  onAvatarClick?: () => void;
}

export default function Header({ 
  title = '集友众包', 
  showBack = false, 
  onBack,
  showMenu = false,
  showSearch = true,
  showProfile = true,
  onAvatarClick
}: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-highest transition-colors active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
        ) : showMenu ? (
          <button className="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95">
            <Menu className="w-6 h-6 text-primary" />
          </button>
        ) : (
          <button 
            onClick={onAvatarClick}
            className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border-2 border-primary/10 active:scale-95 transition-transform"
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuANzdxCLlKNAf2xoyd5wqizafd0EKd9DAePfTnCi4CMng_XcEG1_crkqvPLmMBfe3f-lun2_aYmW_4yjNYINvgmPRQruDhxJ3_5gtCRGs7QyRuZkRKAnVxAtafJuPEU5XF3MiQan9oYYTNZg_Mg6Z_k8TTvw1uW_XVfEBWe7OPuOU42ZkJhN4UbExySTj4Jw_vR7xiMv5I2ny5Cu4-lgn_4V-uEaP1LMJ3mpLhEOUT2U_Z6BL9nkSjNDI1CR7RvWERhCSu5Fr4Jh0k" 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        )}
        <h1 className="text-xl font-black text-primary font-headline tracking-tight">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {showSearch && (
          <button className="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95">
            <Search className="w-6 h-6 text-primary" />
          </button>
        )}
      </div>
    </header>
  );
}
