import { useState } from 'react';

export const useShare = () => {
  const [shareModal, setShareModal] = useState({
    isOpen: false,
    content: null
  });

  const sharePoll = (poll) => {
    const shareContent = {
      type: 'poll',
      title: poll.question || 'Vota en esta encuesta',
      description: 'Mira esta increíble votación y comparte tu opinión',
      url: `${window.location.origin}/poll/${poll.id}`,
      imageUrl: poll.options?.[0]?.imageUrl // Usar primera imagen como thumbnail
    };

    setShareModal({
      isOpen: true,
      content: shareContent
    });
  };

  const shareProfile = (user) => {
    const shareContent = {
      type: 'profile',
      title: `Perfil de ${user.display_name || user.username}`,
      description: user.bio || `Mira el perfil de ${user.display_name || user.username} en nuestra plataforma`,
      url: `${window.location.origin}/profile/${user.username}`,
      imageUrl: user.avatar_url
    };

    setShareModal({
      isOpen: true,
      content: shareContent
    });
  };

  const closeShareModal = () => {
    setShareModal({
      isOpen: false,
      content: null
    });
  };

  return {
    shareModal,
    sharePoll,
    shareProfile,
    closeShareModal
  };
};

export default useShare;