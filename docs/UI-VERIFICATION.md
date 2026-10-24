# Application verification — 24 October 2026

Checked through the real browser UI:

- Main menu and character creation, including name, defender position and curly hairstyle.
- One complete 20-choice career from age 8 through retirement at 38, including all five chapter transitions and simulated season recaps.
- Real club moves: the tested defender played professionally for Meranti Athletic, Solana Deportivo and Monteluz CF. The final career showed 560 appearances, 48 goals, 79 assists, 4 trophies and 2,451 defensive contributions; all summary values came from accumulated career state.
- A committed childhood result was captured, the page reloaded, Continue selected, and the displayed result compared: identical. Ratings and rewards did not duplicate.
- Settings dialog, fast play, result skipping, career journal and the retirement screen were exercised.
- The career card download completed and the resulting file was inspected: a real 1200×1600 PNG. Its exported articulated player preserves the chosen skin, curly hairstyle, veteran face, and club jersey. The card uses actual identity and totals.
- Production offline reload verified: after assets were cached, the preview server was stopped; the browser reloaded successfully from the service worker, restored the committed result, and advanced to the next decision at age 10.
- Desktop layout at 1366×900 and phone layout at 375×812 inspected. A phone menu overflow was found and corrected by removing the illustration frame's intrinsic minimum width.
- Screenshots are retained in `docs/screenshots/`; archive cover asset in `docs/archive-assets/kicktale/cover.png` is ready to copy to BAYSTRIX LAB's `public/projects/kicktale/cover.png`.

All visible copy is Indonesian. Automated engine coverage is documented separately in ENGINE-VERIFICATION.md. Native file sharing uses feature detection; download fallback was tested. Native sharing sheets and physical touch hardware were not exercised. Audio is synthesized only after a user interaction; listening quality was not formally assessed.
