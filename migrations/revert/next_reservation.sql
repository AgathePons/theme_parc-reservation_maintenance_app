-- Revert oparc:next_reservation from pg

BEGIN;

DROP FUNCTION valid_slot, isEnoughPlacesRemainig, NextSlot;

COMMIT;
