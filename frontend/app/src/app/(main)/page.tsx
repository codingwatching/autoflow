'use client';

import { Ask } from '@/components/chat/ask';
import { useAsk } from '@/components/chat/use-ask';
import { withReCaptcha } from '@/components/security-setting-provider';
import { SystemWizardBanner } from '@/components/system/SystemWizardBanner';
import { Button } from '@/components/ui/button';
import DotPattern from '@/components/ui/dot-pattern';
import { useSettingContext } from '@/components/website-setting-provider';
import { cn } from '@/lib/utils';
import NextLink from 'next/link';

const security: { google_recaptcha_site_key: string, google_recaptcha: 'v3' | 'enterprise' | '' } | null = null;

export default function Page () {
  const { loading, disabled, setEngine, ask, engine } = useAsk();
  const { homepage_title, description, homepage_example_questions, homepage_footer_links } = useSettingContext();

  return (
    <div className="h-screen relative">
      <SystemWizardBanner />
      <div className="lg:h-[calc(100%-var(--ask-referral-height))] h-2/3 p-4 lg:p-0 flex flex-col items-center justify-center gap-4 relative">
        <div className='absolute size-full pointer-events-none flex items-center justify-center'>
          <DotPattern
            className={cn(
              '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]',
            )}
          />
        </div>
        <h1 className="text-2xl sm:text-4xl font-light text-center">
          {homepage_title || ''}
        </h1>
        <p className="font-light dark:text-gray-300 text-gray-500 mb-4 w-4/5 md:w-auto text-center">
          {description || ''}
        </p>
        <Ask className="z-0 px-4 w-full lg:w-2/3" disabled={disabled} loading={loading} ask={ask} engine={engine} setEngine={setEngine} />
        {homepage_example_questions && (<ul className="z-0 flex gap-2 flex-wrap px-4 w-full lg:w-2/3">
          {homepage_example_questions.map((item, index) => (
            <li key={index}>
              <Button
                className="g-recaptcha font-normal text-xs"
                disabled={loading}
                variant="secondary"
                size="sm"
                onClick={() => {
                  withReCaptcha({
                    action: 'ask',
                    siteKey: security?.google_recaptcha_site_key || '',
                    mode: security?.google_recaptcha,
                  }, ({ token, action }) => {
                    ask(item, {
                      headers: {
                        'X-Recaptcha-Token': token,
                        'X-Recaptcha-Action': action,
                      },
                    });
                  });
                }}
              >
                {item}
              </Button>
            </li>
          ))}
        </ul>)}
      </div>
      <div className="lg:h-[var(--ask-referral-height)] h-1/3 flex lg:justify-center justify-end items-center gap-4 lg:flex-row flex-col pb-4 lg:pb-0" style={{ display: 'auto' }}>
        {homepage_footer_links?.map(link => (
          <NextLink key={link.text} href={link.href} target="_blank" className={cn('font-light text-sm hover:underline opacity-50 flex justify-center', isHighlightedLinkText(link.text) && 'font-semibold text-yellow-500 dark:text-yellow-400 opacity-100 underline')}>
            {trimHighlightedLinkText(link.text)}
          </NextLink>
        ))}
      </div>
    </div>
  );
}

function isHighlightedLinkText (text: string) {
  return text.startsWith('*') && text.endsWith('*')
}

function trimHighlightedLinkText (text: string) {
  if (isHighlightedLinkText(text)) {
    return text.slice(1, -1)
  }
  return text
}
