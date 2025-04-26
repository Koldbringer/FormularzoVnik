import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";
import VoiceNote from "./VoiceNote";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Cloud, Loader2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { supabase, TABLES, FormSubmission, VoiceNote as VoiceNoteType } from "@/lib/supabase";

const HVAC_TYPES = [
  { value: "serwis", label: "Serwis" },
  { value: "naprawa", label: "Naprawa" },
  { value: "montaz", label: "Montaż" },
];

const HvacForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [desc, setDesc] = useState("");
  const [voiceNote, setVoiceNote] = useState("");
  const [serviceType, setServiceType] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast: showToast } = useToast();

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setCity("");
    setDesc("");
    setVoiceNote("");
    setServiceType(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Proszę podać imię i nazwisko");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create voice note record if there's a transcription
      let voiceNoteId: string | undefined = undefined;

      if (voiceNote) {
        const voiceNoteData: VoiceNoteType = {
          transcription: voiceNote,
        };

        const { data: voiceNoteRecord, error: voiceNoteError } = await supabase
          .from(TABLES.VOICE_NOTES)
          .insert(voiceNoteData)
          .select('id')
          .single();

        if (voiceNoteError) {
          throw new Error(`Error saving voice note: ${voiceNoteError.message}`);
        }

        voiceNoteId = voiceNoteRecord?.id;
      }

      // Create form submission record
      const formData: FormSubmission = {
        name,
        phone: phone || undefined,
        email: email || undefined,
        address: address || undefined,
        city: city || undefined,
        service_type: serviceType,
        description: desc || undefined,
        voice_note_id: voiceNoteId,
      };

      const { error: formError } = await supabase
        .from(TABLES.FORM_SUBMISSIONS)
        .insert(formData);

      if (formError) {
        throw new Error(`Error saving form: ${formError.message}`);
      }

      // Show success message
      toast.success("Dziękujemy za zgłoszenie! Wkrótce się skontaktujemy.");
      showToast({
        title: "Dziękujemy za zgłoszenie!",
        description: "Twój formularz został wysłany. Wkrótce się skontaktujemy.",
        duration: 5000,
      });

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Wystąpił błąd podczas wysyłania formularza. Spróbuj ponownie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto p-8 shadow-lg border-0 rounded-3xl bg-white/80 backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-3 items-center mb-5 border-b pb-4 border-blue-100">
          <Cloud className="text-blue-500 w-9 h-9" />
          <h2 className="font-playfair text-2xl text-blue-900 font-semibold">

          </h2>
        </div>
        <div>
          <Label htmlFor="name" className="text-blue-800 font-medium">Imię i nazwisko*</Label>
          <Input
            required
            id="name"
            name="name"
            type="text"
            placeholder="Jan Chłodziarski"
            className="bg-blue-50 mt-1 font-medium border-blue-100 focus:border-blue-300 focus:ring-blue-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-blue-800 font-medium">Telefon</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="600 100 901"
            className="bg-blue-50 mt-1 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-blue-800 font-medium">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="klient@adres.pl"
            className="bg-blue-50 mt-1 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="address" className="text-blue-800 font-medium">Adres</Label>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="ul. Przykładowa 123"
              className="bg-blue-50 mt-1 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="street-address"
            />
          </div>
          <div>
            <Label htmlFor="city" className="text-blue-800 font-medium">Miasto</Label>
            <Input
              id="city"
              name="city"
              type="text"
              placeholder="Warszawa"
              className="bg-blue-50 mt-1 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              autoComplete="address-level2"
            />
          </div>
        </div>
        {/* HVAC Service Type toggle group */}
        <div className="mt-2">
          <div className="text-blue-800 font-medium mb-1">Typ usługi</div>
          <ToggleGroup
            type="single"
            value={serviceType}
            onValueChange={setServiceType}
            className="mt-2 flex w-full justify-between gap-3"
            aria-label="Typ usługi"
          >
            {HVAC_TYPES.map((t) => (
              <ToggleGroupItem
                key={t.value}
                value={t.value}
                aria-label={t.label}
                className="flex-1 rounded-xl font-semibold text-blue-900 bg-blue-50 border-blue-100 transition hover:bg-blue-100 data-[state=on]:bg-blue-200 data-[state=on]:border-blue-300 animated-service-toggle"
              >
                {t.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="mt-2">
          <Label htmlFor="desc" className="text-blue-800 font-medium">Opis (opcjonalnie)</Label>
          <textarea
            id="desc"
            name="desc"
            placeholder="Opisz swoje zapytanie, np. montaż klimatyzacji w domu..."
            className="w-full min-h-[80px] p-3 rounded border mt-1 bg-blue-50 font-normal border-blue-100 focus:border-blue-300 focus:ring-blue-200"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            autoComplete="off"
          />
        </div>
        <VoiceNote value={voiceNote} setValue={setVoiceNote} />
        <Button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100 text-blue-900 font-semibold rounded-xl shadow-md hover:from-blue-400 hover:to-blue-200 transition-all py-6"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Wysyłanie formularza...
            </>
          ) : (
            "Wyślij zgłoszenie"
          )}
        </Button>
      </form>
    </Card>
  );
};

export default HvacForm;
