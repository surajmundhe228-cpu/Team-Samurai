import React from "react";

function EmergencyGuide() {
  return (
    <div className="emergency-guide-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="emergency-heading">

        <div>
          <h1>Emergency Guide</h1>

          <p>
            Advanced flood safety and emergency
            response information available offline.
          </p>
        </div>

        <div className="offline-badge">
          📴 Available Offline
        </div>

      </div>


      {/* =========================
          EMERGENCY ALERT
      ========================= */}

      <div className="emergency-alert">

        <div className="emergency-alert-icon">
          🚨
        </div>

        <div className="emergency-alert-content">

          <h2>Flood Emergency</h2>

          <p>
            If flooding is occurring or evacuation
            has been ordered, move to a safe,
            elevated location immediately.
            Do not wait for water levels to rise.
          </p>

          <strong>
            If your life is in immediate danger,
            call 112.
          </strong>

        </div>

      </div>


      {/* =========================
          EMERGENCY CONTACTS
      ========================= */}

      <section className="emergency-section">

        <div className="emergency-section-header">

          <div className="section-icon">
            📞
          </div>

          <div>
            <h2>Emergency Contacts</h2>

            <p>
              Important emergency numbers to use
              during a flood or disaster.
            </p>
          </div>

        </div>


        <div className="emergency-contact-grid">

          {/* 112 */}

          <div className="emergency-contact-card priority-contact">

            <div className="contact-icon">
              🚨
            </div>

            <div className="contact-info">

              <span className="contact-label">
                National Emergency
              </span>

              <h3>112</h3>

              <p>
                Unified emergency assistance for
                police, fire, medical and other
                emergencies.
              </p>

              <a
                href="tel:112"
                className="contact-call"
              >
                📞 Call 112
              </a>

            </div>

          </div>


          {/* NDMA */}

          <div className="emergency-contact-card">

            <div className="contact-icon">
              🏛️
            </div>

            <div className="contact-info">

              <span className="contact-label">
                NDMA Control Room
              </span>

              <h3>011-26701728</h3>

              <p>
                National Disaster Management
                Authority control room.
              </p>

              <a
                href="tel:+911126701728"
                className="contact-call"
              >
                📞 Call NDMA
              </a>

            </div>

          </div>


          {/* Police */}

          <div className="emergency-contact-card">

            <div className="contact-icon">
              👮
            </div>

            <div className="contact-info">

              <span className="contact-label">
                Police Emergency
              </span>

              <h3>100</h3>

              <p>
                Traditional police emergency
                number. 112 is the preferred
                unified emergency number.
              </p>

              <a
                href="tel:100"
                className="contact-call"
              >
                📞 Call 100
              </a>

            </div>

          </div>


          {/* Fire */}

          <div className="emergency-contact-card">

            <div className="contact-icon">
              🔥
            </div>

            <div className="contact-info">

              <span className="contact-label">
                Fire & Rescue
              </span>

              <h3>101</h3>

              <p>
                Traditional fire emergency
                number. Use 112 for unified
                emergency assistance.
              </p>

              <a
                href="tel:101"
                className="contact-call"
              >
                📞 Call 101
              </a>

            </div>

          </div>


          {/* Ambulance */}

          <div className="emergency-contact-card">

            <div className="contact-icon">
              🚑
            </div>

            <div className="contact-info">

              <span className="contact-label">
                Ambulance
              </span>

              <h3>108</h3>

              <p>
                Emergency ambulance service where
                available. 112 can also be used for
                emergency assistance.
              </p>

              <a
                href="tel:108"
                className="contact-call"
              >
                📞 Call 108
              </a>

            </div>

          </div>


          {/* Local Control Room */}

          <div className="emergency-contact-card">

            <div className="contact-icon">
              🏢
            </div>

            <div className="contact-info">

              <span className="contact-label">
                Local Disaster Control Room
              </span>

              <h3>Verify Local Number</h3>

              <p>
                Add the verified district or state
                disaster-management control room
                number for your deployment area.
              </p>

              <div className="contact-note">
                ⚠️ Configure verified local number
              </div>

            </div>

          </div>

        </div>


        <div className="emergency-contact-notice">

          <span>⚠️</span>

          <div>

            <strong>
              Emergency Calling Information
            </strong>

            <p>
              If you are in immediate danger, call
              <strong> 112 </strong>
              first. Keep your village name,
              location, nearest landmark and number
              of people requiring assistance ready
              when speaking with emergency responders.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          IMMEDIATE ACTIONS
      ========================= */}

      <section className="emergency-section">

        <div className="emergency-section-header">

          <div className="section-icon">
            ⚡
          </div>

          <div>
            <h2>Immediate Emergency Actions</h2>

            <p>
              Follow these steps when flooding begins
              or evacuation is announced.
            </p>
          </div>

        </div>


        <div className="evacuation-steps">

          <div className="evacuation-step">

            <div className="step-number">
              1
            </div>

            <div>
              <h3>Stay Calm</h3>

              <p>
                Stay calm, check on family members
                and identify the safest available
                direction.
              </p>
            </div>

          </div>


          <div className="evacuation-step">

            <div className="step-number">
              2
            </div>

            <div>
              <h3>Move to Higher Ground</h3>

              <p>
                Move away from rivers, streams,
                drainage channels and low-lying
                areas.
              </p>
            </div>

          </div>


          <div className="evacuation-step">

            <div className="step-number">
              3
            </div>

            <div>
              <h3>Follow the Evacuation Plan</h3>

              <p>
                Use the assigned evacuation route
                and proceed toward the designated
                shelter or safe elevated location.
              </p>
            </div>

          </div>


          <div className="evacuation-step">

            <div className="step-number">
              4
            </div>

            <div>
              <h3>Help Vulnerable People</h3>

              <p>
                Prioritize children, elderly people,
                pregnant people and anyone requiring
                additional assistance.
              </p>
            </div>

          </div>


          <div className="evacuation-step">

            <div className="step-number">
              5
            </div>

            <div>
              <h3>Reach a Safe Location</h3>

              <p>
                Stay at the shelter or another safe
                elevated location until authorities
                confirm that it is safe to return.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          DURING FLOOD
      ========================= */}

      <section className="emergency-section">

        <div className="emergency-section-header">

          <div className="section-icon">
            🌊
          </div>

          <div>
            <h2>During a Flood</h2>

            <p>
              Critical actions to reduce risk during
              active flooding.
            </p>
          </div>

        </div>


        <div className="advanced-grid">

          <div className="advanced-card">

            <div className="emergency-card-icon">
              🏃
            </div>

            <h3>Evacuate Early</h3>

            <p>
              Do not wait until roads become
              submerged. Leave early when authorities
              issue evacuation instructions.
            </p>

          </div>


          <div className="advanced-card">

            <div className="emergency-card-icon">
              ⬆️
            </div>

            <h3>Move Higher</h3>

            <p>
              Move toward elevated ground or an
              approved safe shelter. Avoid low-lying
              locations.
            </p>

          </div>


          <div className="advanced-card">

            <div className="emergency-card-icon">
              🚗
            </div>

            <h3>Avoid Flooded Roads</h3>

            <p>
              Never drive or walk through moving
              floodwater. Water depth and road
              conditions can be deceptive.
            </p>

          </div>


          <div className="advanced-card">

            <div className="emergency-card-icon">
              📱
            </div>

            <h3>Stay Informed</h3>

            <p>
              Monitor official emergency alerts and
              follow instructions from local
              authorities.
            </p>

          </div>


          <div className="advanced-card">

            <div className="emergency-card-icon">
              🔋
            </div>

            <h3>Save Phone Battery</h3>

            <p>
              Keep your phone charged. Reduce
              unnecessary screen usage and preserve
              battery for emergency communication.
            </p>

          </div>


          <div className="advanced-card">

            <div className="emergency-card-icon">
              👨‍👩‍👧
            </div>

            <h3>Stay With Your Group</h3>

            <p>
              Keep family members together whenever
              possible and establish a meeting point
              if separated.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          FLOODWATER SAFETY
      ========================= */}

      <section className="emergency-section">

        <div className="emergency-section-header">

          <div className="section-icon">
            💧
          </div>

          <div>
            <h2>Floodwater Safety</h2>

            <p>
              Floodwater can contain hidden physical,
              electrical and biological hazards.
            </p>
          </div>

        </div>


        <div className="safety-grid">

          <div className="safety-card">

            <h3>⛔ Do Not Enter Moving Water</h3>

            <p>
              Even shallow moving water can knock
              a person down. Avoid crossing streams,
              drains and flooded roads.
            </p>

          </div>


          <div className="safety-card">

            <h3>🦠 Avoid Contaminated Water</h3>

            <p>
              Floodwater may contain sewage,
              chemicals, waste and other contaminants.
              Avoid contact whenever possible.
            </p>

          </div>


          <div className="safety-card">

            <h3>🥤 Do Not Drink Untreated Water</h3>

            <p>
              Use safe drinking water from an approved
              source. Do not assume floodwater is safe.
            </p>

          </div>


          <div className="safety-card">

            <h3>🐍 Watch for Hidden Hazards</h3>

            <p>
              Flooding can displace animals, debris,
              sharp objects and other hazards. Move
              carefully through unfamiliar areas.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          ELECTRICAL SAFETY
      ========================= */}

      <section className="emergency-section">

        <div className="emergency-section-header">

          <div className="section-icon">
            ⚡
          </div>

          <div>
            <h2>Electrical Safety</h2>

            <p>
              Electricity and floodwater can create
              life-threatening hazards.
            </p>
          </div>

        </div>


        <div className="warning-box">

          <h3>
            ⚠️ Treat Floodwater as Electrically Dangerous
          </h3>

          <ul>

            <li>
              Do not touch electrical equipment
              while standing in water.
            </li>

            <li>
              Stay away from fallen electrical wires.
            </li>

            <li>
              Do not enter buildings with suspected
              electrical damage.
            </li>

            <li>
              Do not attempt electrical repairs
              yourself.
            </li>

            <li>
              Report dangerous electrical conditions
              to the appropriate authorities.
            </li>

          </ul>

        </div>

      </section>


      {/* =========================
          MEDICAL EMERGENCY
      ========================= */}

      <section className="emergency-section">

        <div className="emergency-section-header">

          <div className="section-icon">
            🩹
          </div>

          <div>
            <h2>Medical Emergency</h2>

            <p>
              Take basic immediate action while
              seeking professional medical assistance.
            </p>
          </div>

        </div>


        <div className="medical-grid">

          <div className="medical-card">

            <h3>🚑 Serious Injury</h3>

            <p>
              Call 112 for emergency assistance.
              Keep the injured person safe and avoid
              unnecessary movement if a serious injury
              is suspected.
            </p>

          </div>


          <div className="medical-card">

            <h3>🩸 Severe Bleeding</h3>

            <p>
              Apply firm pressure with clean cloth
              or first-aid material while seeking
              professional medical help.
            </p>

          </div>


          <div className="medical-card">

            <h3>💊 Essential Medicines</h3>

            <p>
              Carry essential prescribed medicines
              and relevant medical information during
              evacuation.
            </p>

          </div>


          <div className="medical-card">

            <h3>🦶 Injury From Debris</h3>

            <p>
              Avoid unnecessary contact with dirty
              floodwater and seek medical advice for
              wounds exposed to contaminated water.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          WARNING SIGNS
      ========================= */}

      <section className="emergency-section">

        <div className="emergency-section-header">

          <div className="section-icon">
            ⚠️
          </div>

          <div>
            <h2>Warning Signs</h2>

            <p>
              These conditions should be treated
              seriously.
            </p>
          </div>

        </div>


        <div className="warning-signs">

          <div>
            🔴 Rapidly rising water levels
          </div>

          <div>
            🔴 Strong or rapidly moving water
          </div>

          <div>
            🔴 Roads becoming submerged
          </div>

          <div>
            🔴 Official evacuation warning
          </div>

          <div>
            🔴 Dam, embankment or drainage failure
          </div>

          <div>
            🔴 Electrical wires or equipment in water
          </div>

          <div>
            🔴 Structural damage to buildings
          </div>

          <div>
            🔴 Increasing isolation from safe roads
          </div>

        </div>

      </section>


      {/* =========================
          EMERGENCY KIT
      ========================= */}

      <section className="emergency-section">

        <div className="emergency-section-header">

          <div className="section-icon">
            🎒
          </div>

          <div>
            <h2>Emergency Kit</h2>

            <p>
              Keep essential supplies ready before
              evacuation becomes necessary.
            </p>
          </div>

        </div>


        <div className="emergency-checklist">

          <div className="kit-item">
            💧 Drinking water
          </div>

          <div className="kit-item">
            🥫 Ready-to-eat food
          </div>

          <div className="kit-item">
            🔦 Flashlight
          </div>

          <div className="kit-item">
            🔋 Extra batteries / power bank
          </div>

          <div className="kit-item">
            📱 Charged mobile phone
          </div>

          <div className="kit-item">
            🩹 First-aid supplies
          </div>

          <div className="kit-item">
            💊 Essential medicines
          </div>

          <div className="kit-item">
            🪪 Identification documents
          </div>

          <div className="kit-item">
            💰 Emergency cash
          </div>

          <div className="kit-item">
            👕 Extra clothes
          </div>

          <div className="kit-item">
            🧼 Hygiene supplies
          </div>

          <div className="kit-item">
            🧥 Rain protection
          </div>

          <div className="kit-item">
            📻 Battery-powered radio
          </div>

          <div className="kit-item">
            🧴 Hand sanitizer
          </div>

          <div className="kit-item">
            🍼 Baby supplies if required
          </div>

          <div className="kit-item">
            🐕 Pet supplies if required
          </div>

        </div>

      </section>


      {/* =========================
          FAMILY SAFETY PLAN
      ========================= */}

      <section className="emergency-section">

        <div className="emergency-section-header">

          <div className="section-icon">
            👨‍👩‍👧
          </div>

          <div>
            <h2>Family Safety Plan</h2>

            <p>
              Prepare a simple plan so everyone knows
              what to do if communication is lost.
            </p>
          </div>

        </div>


        <div className="family-plan">

          <div className="family-plan-item">

            <strong>
              1. Choose a meeting point
            </strong>

            <p>
              Select a safe location outside the
              flood-prone area.
            </p>

          </div>


          <div className="family-plan-item">

            <strong>
              2. Keep emergency contacts
            </strong>

            <p>
              Save important numbers and keep a
              written copy in your emergency kit.
            </p>

          </div>


          <div className="family-plan-item">

            <strong>
              3. Assign responsibilities
            </strong>

            <p>
              Decide who will assist children,
              elderly people and anyone requiring
              additional support.
            </p>

          </div>


          <div className="family-plan-item">

            <strong>
              4. Have a backup communication plan
            </strong>

            <p>
              If mobile networks become unavailable,
              use your predetermined meeting point
              and follow official instructions.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          SHELTER SAFETY
      ========================= */}

      <section className="emergency-section">

        <div className="emergency-section-header">

          <div className="section-icon">
            🏠
          </div>

          <div>
            <h2>At the Relief Shelter</h2>

            <p>
              Follow shelter rules and help maintain
              a safe environment.
            </p>
          </div>

        </div>


        <div className="shelter-safety-grid">

          <div>
            🏠 Register with shelter authorities
            when required.
          </div>

          <div>
            💧 Use drinking water only from
            approved sources.
          </div>

          <div>
            🧼 Maintain hygiene and sanitation.
          </div>

          <div>
            👨‍👩‍👧 Keep your family together.
          </div>

          <div>
            📱 Keep your phone available for
            emergency communication.
          </div>

          <div>
            📢 Follow instructions from shelter
            officials and emergency responders.
          </div>

        </div>

      </section>


      {/* =========================
          DO NOT
      ========================= */}

      <section className="emergency-section">

        <div className="emergency-section-header">

          <div className="section-icon">
            ⛔
          </div>

          <div>
            <h2>Do Not</h2>

            <p>
              Avoid these dangerous actions during
              flood emergencies.
            </p>
          </div>

        </div>


        <div className="do-not-list">

          <div>
            ❌ Do not walk through moving floodwater.
          </div>

          <div>
            ❌ Do not drive through flooded roads.
          </div>

          <div>
            ❌ Do not touch electrical equipment
            if you are wet or standing in water.
          </div>

          <div>
            ❌ Do not approach fallen power lines.
          </div>

          <div>
            ❌ Do not drink untreated floodwater.
          </div>

          <div>
            ❌ Do not ignore evacuation orders.
          </div>

          <div>
            ❌ Do not return to the affected area
            without official clearance.
          </div>

          <div>
            ❌ Do not spread unverified emergency
            information.
          </div>

        </div>

      </section>


      {/* =========================
          AFTER THE FLOOD
      ========================= */}

      <section className="emergency-section">

        <div className="emergency-section-header">

          <div className="section-icon">
            🌤️
          </div>

          <div>
            <h2>After the Flood</h2>

            <p>
              Flood danger can continue even after
              water levels begin to fall.
            </p>
          </div>

        </div>


        <div className="after-flood-grid">

          <div>

            <h3>
              🏚️ Check Buildings
            </h3>

            <p>
              Do not enter damaged buildings until
              they are considered safe.
            </p>

          </div>


          <div>

            <h3>
              ⚡ Watch for Electricity
            </h3>

            <p>
              Stay away from damaged electrical
              systems and fallen wires.
            </p>

          </div>


          <div>

            <h3>
              💧 Check Water Safety
            </h3>

            <p>
              Follow official instructions regarding
              drinking-water safety.
            </p>

          </div>


          <div>

            <h3>
              🦠 Protect Against Contamination
            </h3>

            <p>
              Avoid unnecessary contact with flood
              debris and contaminated water.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          EVACUATION CHECKLIST
      ========================= */}

      <section className="emergency-section">

        <div className="emergency-section-header">

          <div className="section-icon">
            ✅
          </div>

          <div>
            <h2>Final Evacuation Checklist</h2>

            <p>
              Quickly check these items before leaving.
            </p>
          </div>

        </div>


        <ol className="emergency-list">

          <li>
            Take your emergency kit.
          </li>

          <li>
            Take essential medicines and important
            identification documents.
          </li>

          <li>
            Confirm that family members are together.
          </li>

          <li>
            Switch off utilities only if it is safe
            and authorities advise you to do so.
          </li>

          <li>
            Follow the designated evacuation route.
          </li>

          <li>
            Avoid flooded roads and shortcuts.
          </li>

          <li>
            Reach the assigned shelter or safe
            elevated location.
          </li>

          <li>
            Inform emergency responders if someone
            is missing or needs urgent assistance.
          </li>

        </ol>

      </section>


      {/* =========================
          IMPORTANT NOTICE
      ========================= */}

      <div className="emergency-important">

        <div className="important-icon">
          ⚠️
        </div>

        <div>

          <strong>
            Important Safety Notice
          </strong>

          <p>
            This Emergency Guide is designed to
            remain available when the Reloc8 system
            is offline. Offline information may not
            contain the latest local warnings or
            evacuation orders.
          </p>

          <p>
            When communication is available, always
            follow instructions from local emergency
            authorities and official disaster
            management agencies.
          </p>

        </div>

      </div>


      {/* =========================
          OFFLINE NOTICE
      ========================= */}

      <div className="offline-note">

        <span>
          📴
        </span>

        <div>

          <strong>
            Offline Emergency Information
          </strong>

          <p>
            This page does not require an internet
            connection. Emergency phone calls require
            cellular or other available communication
            service.
          </p>

        </div>

      </div>

    </div>
  );
}

export default EmergencyGuide;