'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import SetPreferenceFirstPage from '@/components/features/set-preference/set-preference-first-page';
import SetPreferenceDetailPage from '@/components/features/set-preference/set-preference-detail-page';
import SetPreferenceFinishPage from '@/components/features/set-preference/set-preference-finish-page';
import { useUserStore } from '@/lib/stores/user';
import { sectionLabels, sectionMappingId } from '@/types/types';
import { UpdatePreferencesRequestDto } from '@/types/dto';
import { authUpdatePreferences } from '@/lib/apis/apis';
import { toast } from '@/components/ui/toast';
import SetPreferenceWaitPage from '@/components/features/set-preference/set-preference-wait-page';
import { SITEMAP } from '@/data/sitemap';

const SetPreferencesPage = () => {
  const [step, setStep] = useState<'first' | 'detail' | 'finish' | 'wait'>('first');
  const router = useRouter();

  const handlePreferenceDone = async () => {
    setStep('wait');

    const preferences = useUserStore.getState().preferences;
    const request = sectionLabels.reduce((acc, label) => {
      acc.push({ sectionId: sectionMappingId[label], preference: preferences[label] });
      return acc;
    }, [] as UpdatePreferencesRequestDto);

    const { error } = await authUpdatePreferences(request);
    if (!error) return router.push(SITEMAP.HOME);
    toast.serverError();
  };

  return (
    <main className="flex h-screen flex-col">
      {step !== 'wait' && (
        <header className="px-8 pt-6">
          <h2 className="text-center typography-small-title">맞춤 설정</h2>
        </header>
      )}
      {step === 'first' && <SetPreferenceFirstPage onConfirm={() => setStep('detail')} />}
      {step === 'detail' && <SetPreferenceDetailPage onConfirm={() => setStep('finish')} />}
      {step === 'finish' && (
        <SetPreferenceFinishPage onReSetup={() => setStep('detail')} onConfirm={handlePreferenceDone} />
      )}
      {step === 'wait' && <SetPreferenceWaitPage />}
    </main>
  );
};

export default SetPreferencesPage;
